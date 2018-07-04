import Item from '../data/Item'
import Collection from '../data/Collection'
import EntityCollection from '../data/EntityCollection'
import ActionsContract from './contracts/Actions'
import ActionContext from './contracts/ActionContext'
import * as Payloads from './payloads/Actions'

const Actions: ActionsContract = {
  /**
   * Save new data to the state. It will remove all existing data in the
   * state. If you want to keep existing data while saving new data,
   * use `insert` instead.
   */
  async create (context: ActionContext, payload: Payloads.Create): Promise<EntityCollection> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/create`, { entity, ...payload }, { root: true })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  async insert (context: ActionContext, payload: Payloads.Insert): Promise<EntityCollection> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/insert`, { entity, ...payload }, { root: true })
  },

  /**
   * Update data in the store.
   */
  async update (context: ActionContext, payload: Payloads.Update): Promise<EntityCollection> {
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
  async insertOrUpdate (context: ActionContext, payload: Payloads.Insert): Promise<EntityCollection> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/insertOrUpdate`, { entity, ...payload }, { root: true })
  },

  /**
   * Delete data from the store.
   */
  async delete (context: ActionContext, payload: Payloads.Delete): Promise<Item | Collection> {
    const state = context.state
    const entity = state.$name
    const where = typeof payload === 'object' ? payload.where : payload

    return context.dispatch(`${state.$connection}/delete`, { entity, where }, { root: true })
  },

  /**
   * Delete all data from the store.
   */
  async deleteAll (context: ActionContext): Promise<Collection | void> {
    const state = context.state
    const entity = state.$name

    return context.dispatch(`${state.$connection}/deleteAll`, { entity }, { root: true })
  }
}

export default Actions
