import Collection from '../../data/Collection'
import Instances from '../../data/Instances'
import Model from '../../model/Model'
import Query from '../Query'
import BeforeDeleteHook from '../contracts/BeforeDeleteHook'
import AfterDeleteHook from '../contracts/AfterDeleteHook'
import GlobalHook from './GlobalHook'
import GlobalHooks from './GlobalHooks'

export default class Hook {
  /**
   * Global lifecycle hooks for the query.
   */
  static hooks: GlobalHooks = {}

  /**
   * Hook UID counter.
   */
  static lastHookId: number = 0

  /**
   * The query instance.
   */
  query: Query

  /**
   * The global hook index to be deleted.
   */
  indexToBeDeleted: number[] = []

  /**
   * Create a lidecycle hook instance.
   */
  constructor (query: Query) {
    this.query = query
  }

  /**
   * Register a callback. It Returns unique ID for registered callback.
   */
  static on (on: string, callback: Function, once: boolean = false): number {
    const uid = this.lastHookId + 1

    this.lastHookId = uid

    if (!this.hooks[on]) {
      this.hooks[on] = []
    }

    this.hooks[on].push({ callback, once, uid })

    return uid
  }

  /**
   * Remove hook registration.
   */
  static off (uid: number): boolean {
    let removed: boolean = false

    Object.keys(this.hooks).some((on) => {
      const hook = this.hooks[on]

      const index = hook.findIndex(h => h.uid === uid)

      if (index !== -1) {
        hook.splice(index, 1)

        removed = true
      }

      return removed
    })

    return removed
  }

  /**
   * Get the hook class.
   */
  self (): typeof Hook {
    return this.constructor as typeof Hook
  }

  /**
   * Get the hook for the given name.
   */
  getHook (name: string): Function | null {
    const hook = this.query.model[name] as Function | undefined

    return hook || null
  }

  /**
   * Get the global hook.
   */
  getGlobalHook (name: string): GlobalHook[] | null {
    const hook = this.self().hooks[name]

    return hook || null
  }

  /**
   * Check if the given hook exist.
   */
  has (name: string): boolean {
    return !!this.getHook(name) || !!this.getGlobalHook(name)
  }

  /**
   * Execute select hook for the given collection.
   */
  executeSelectHook (on: string, records: Collection): Collection {
    if (!this.has(on)) {
      return records
    }

    records = this.executeLocalSelectHook(on, records)
    records = this.executeGlobalSelectHook(on, records)

    return records
  }

  /**
   * Execute select hook against given records.
   */
  executeLocalSelectHook (on: string, records: Collection): Collection {
    const hook = this.getHook(on)

    if (!hook) {
      return records
    }

    return hook(records, this.query.entity)
  }

  /**
   * Execute the global select hook against given records.
   */
  executeGlobalSelectHook (on: string, records: Collection): Collection {
    const hooks = this.getGlobalHook(on)

    if (!hooks) {
      return records
    }

    // Track indexes to delete.
    let deleteHookIndexes: number[] = []

    // Loop all hooks.
    hooks.forEach((hook, hookIndex) => {
      const { callback, once } = hook

      records = callback.call(this.query, records, this.query.entity)

      // Add hook index to delete.
      once && deleteHookIndexes.push(hookIndex)
    })

    // Remove hooks to be deleted in reverse order.
    deleteHookIndexes.reverse().forEach((hookIndex) => {
      hooks.splice(hookIndex, 1)
    })

    return records
  }

  /**
   * Execute the callback for all given records.
   */
  executeMutationHookOnRecords (on: string, records: Instances): void {
    if (!this.has(on)) {
      return
    }

    Object.keys(records).forEach((id) => {
      const result = this.executeMutationHook(on, records[id])

      if (result === false) {
        delete records[id]
      }
    })

    this.removeGlobalHook(on)
  }

  /**
   * Execute mutation hook against given model.
   */
  executeMutationHook (on: string, model: Model): void | boolean {
    if (this.executeLocalMutationHook(on, model) === false) {
      return false
    }

    if (this.executeGlobalMutationHook(on, model) === false) {
      return false
    }
  }

  /**
   * Execute the local mutation hook.
   */
  executeLocalMutationHook (on: string, model: Model): void | boolean {
    const hook = this.getHook(on)

    if (!hook) {
      return
    }

    return hook(model, this.query.entity)
  }

  /**
   * Execute the global mutation hook.
   */
  executeGlobalMutationHook (on: string, model: Model): void | boolean {
    const hooks = this.getGlobalHook(on)

    if (!hooks) {
      return
    }

    // Track results.
    const results: (boolean | void)[] = []

    // Loop all hooks.
    hooks.forEach((hook, index) => {
      results.push(hook.callback.call(this.query, model, this.query.entity))

      // Add hook index to delete.
      hook.once && this.indexToBeDeleted.push(index)
    })

    if (results.includes(false)) {
      return false
    }
  }

  /**
   * Remove global hooks which are executed and defined as once.
   */
  removeGlobalHook (on: string): void {
    const hooks = this.getGlobalHook(on)

    if (!hooks) {
      return
    }

    this.indexToBeDeleted.reverse().forEach(index => { hooks.splice(index, 1) })
  }

  /**
   * Execute before delete hook to the given model.
   */
  executeBeforeDeleteHook (model: Model): false | void {
    if (this.executeLocalBeforeDeleteHook(model) === false) {
      return false
    }
  }

  /**
   * Execute local before delete hook to the given model.
   */
  private executeLocalBeforeDeleteHook (model: Model): false | void {
    const hook = this.query.model['beforeDelete'] as BeforeDeleteHook | undefined

    return hook && hook(model)
  }

  /**
   * Execute after delete hook to the given model.
   */
  executeAfterDeleteHook (model: Model): void {
    this.executeLocalAfterDeleteHook(model)
  }

  /**
   * Execute local after delete hook to the given model.
   */
  private executeLocalAfterDeleteHook (model: Model): void {
    const hook = this.query.model['afterDelete'] as AfterDeleteHook | undefined

    return hook && hook(model)
  }
}
