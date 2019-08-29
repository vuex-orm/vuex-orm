import Item from '../../data/Item'
import Collection from '../../data/Collection'
import Predicate from '../contracts/Predicate'
import Query from '../query'

export default class Deleter {
  /**
   * The query instance.
   */
  query: Query

  /**
   * Create a new deleter instance.
   */
  constructor (query: Query) {
    this.query = query
  }

  /**
   * Delete matching records with the given condition from the store.
   */
  delete (condition: string | number): Item
  delete (condetion: Predicate): Collection
  delete (condition: any): any {
    if (typeof condition === 'function') {
      return this.performDelete(condition)
    }

    return this.deleteById(condition)
  }

  /**
   * Delete all records from the store. Even when deleting all records, we'll
   * iterate over all records to ensure that before and after hook will be
   * called for each existing records.
   */
  deleteAll (): Collection {
    // If the target entity is the base entity and not inherited entity, we can
    // just delete all records.
    if (this.query.appliedOnBase) {
      return this.performDelete(() => true)
    }

    // Otherwise, we should filter out any derived entities from being deleted
    // so we'll add such filter here.
    return this.performDelete(model => model instanceof this.query.model)
  }

  /**
   * Delete a record from the store by given id.
   */
  private deleteById (id: string | number): Item {
    const item = this.query.whereId(id).first()

    if (!item) {
      return null
    }

    return this.performDelete(model => model.$id === item.$id)[0]
  }

  /**
   * Perform the actual delete query to the store.
   */
  private performDelete (condition: Predicate): Collection {
    const deleted: Collection = []

    this.query.filterData((model) => {
      if (!condition(model)) {
        return true
      }

      if (this.query.hook.executeBeforeDeleteHook(model) === false) {
        return true
      }

      deleted.push(model)

      this.query.hook.executeAfterDeleteHook(model)

      return false
    })

    return deleted
  }
}
