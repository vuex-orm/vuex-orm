import Instances from '../data/Instances'
import Collection from '../data/Collection'
import Query from './Query'

export interface GlobalHook {
  callback: Function
  once?: boolean
  uid: number
}

export interface GlobalHooks {
  [on: string]: GlobalHook[]
}

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
   * Get the action hook.
   */
  getActionHook (name: string): Function | null {
    const hook = this.query.module.actions && this.query.module.actions[name] as Function

    return hook || null
  }

  /**
   * Get the global hook.
   */
  getGlobalHook (name: string): GlobalHook[] | null {
    if (!this.self().hooks[name]) {
      return null
    }

    return this.self().hooks[name]
  }

  /**
   * Check if the given hook exist.
   */
  has (name: string): boolean {
    return !!this.getActionHook(name) || !!this.getGlobalHook(name)
  }

  /**
   * Execute the callback of the given hook.
   */
  execute (on: string, data: any): any {
    if (!this.has(on)) {
      return data
    }

    data = this.executeActionHook(on, data)
    data = this.executeGlobalHook(on, data)

    return data
  }

  /**
   * Execute the action hook.
   */
  executeActionHook (on: string, data: any): any {
    const hook = this.getActionHook(on)

    if (!hook) {
      return data
    }

    const result = hook({}, data)

    if (result === false) {
      return false
    }

    return result || data
  }

  /**
   * Execute the global callback of the given hook.
   */
  executeGlobalHook (on: string, data: any): any {
    if (data === false) {
      return false
    }

    const hooks = this.getGlobalHook(on)

    if (!hooks) {
      return data
    }

    // Track indexes to delete.
    let deleteHookIndexes: number[] = []

    // Loop all hooks.
    hooks.forEach((hook, hookIndex) => {
      const { callback, once } = hook

      data = callback.call(this.query, data, this.query.entity)

      // Add hook index to delete.
      once && deleteHookIndexes.push(hookIndex)
    })

    // Remove hooks to be deleted in reverse order.
    deleteHookIndexes.reverse().forEach((hookIndex) => {
      hooks.splice(hookIndex, 1)
    })

    return data
  }

  /**
   * Execute the callback for all given records.
   */
  executeOnRecords (on: string, records: Instances): void {
    if (!this.has(on)) {
      return
    }

    Object.keys(records).forEach((id) => {
      const record = records[id]

      const result = this.execute(on, record)

      if (result === false) {
        delete records[id]
      }
    })
  }

  /**
   * Execute the callback for the given collection.
   */
  executeOnCollection (on: string, collection: Collection): Collection {
    if (!this.has(on)) {
      return collection
    }

    collection.map(item => { this.execute(on, item) })

    return collection
  }
}
