import Item from '../data/Item'
import Collection from '../data/Collection'
import Collections from '../data/Collections'
import ActionsContract from './contracts/Actions'
import ActionContext from './contracts/ActionContext'
import * as Payloads from './payloads/Actions'

const Actions: ActionsContract = {
  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (context: ActionContext, payload: Payloads.Create): Promise<Collections> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/create`, { ...payload, entity }, { root: true })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (context: ActionContext, payload: Payloads.Insert): Promise<Collections> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/insert`, { ...payload, entity }, { root: true })
  },

  /**
   * Update data in the store.
   */
  update (context: ActionContext, payload: Payloads.Update): Promise<Item | Collection | Collections> {
    const state = context.state
    const entity = state.$name

    // If the payload is an array, then the payload should be an array of
    // data so let's pass the whole payload as data.
    if (Array.isArray(payload)) {
      return context.dispatch(`${state.$connection}/update`, { entity, data: payload }, { root: true })
    }

    // If the payload doesn't have `data` property, we'll assume that
    // the user has passed the object as the payload so let's define
    // the whole payload as a data.
    if (payload.data === undefined) {
      return context.dispatch(`${state.$connection}/update`, { entity, data: payload }, { root: true })
    }

    // Else destructure the payload and let root action handle it.
    return context.dispatch(`${state.$connection}/update`, { entity, ...payload }, { root: true })
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (context: ActionContext, payload: Payloads.InsertOrUpdate): Promise<Collections> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/insertOrUpdate`, { entity, ...payload }, { root: true })
  },

  /**
   * Delete data from the store.
   */
  delete (context: ActionContext, payload: Payloads.Delete): Promise<Item | Collection> {
    const state = context.state
    const entity = state.$name
    const where = typeof payload === 'object' ? payload.where : payload

    return context.dispatch(`${state.$connection}/delete`, { entity, where }, { root: true })
  },

  /**
   * Delete all data from the store.
   */
  deleteAll (context: ActionContext): Promise<void> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/deleteAll`, { entity }, { root: true })
  }
}

export default Actions
