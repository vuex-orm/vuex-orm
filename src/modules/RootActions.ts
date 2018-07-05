import Item from '../data/Item'
import Collection from '../data/Collection'
import EntityCollection from '../data/EntityCollection'
import Query from '../query/Query'
import OptionsBuilder from './support/OptionsBuilder'
import ActionsContract from './contracts/RootActions'
import ActionContext from './contracts/RootActionContext'
import * as Payloads from './payloads/RootActions'

const RootActions: ActionsContract = {
  /**
   * Save new data to the state. It will remove all existing data in the
   * state. If you want to keep existing data while saving new data,
   * use `insert` instead.
   */
  async create (context: ActionContext, payload: Payloads.Create): Promise<EntityCollection> {
    const state = context.state
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    return (new Query(state, entity)).setActionContext(context).create(data, options)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  async insert (context: ActionContext, payload: Payloads.Insert): Promise<EntityCollection> {
    const state = context.state
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    return (new Query(state, entity)).setActionContext(context).insert(data, options)
  },

  /**
   * Update data in the store.
   */
  async update (context: ActionContext, payload: Payloads.Update): Promise<Item | Collection | EntityCollection> {
    const state = context.state
    const entity = payload.entity
    const data = payload.data
    const where = payload.where
    const options = OptionsBuilder.createPersistOptions(payload)

    return (new Query(state, entity)).setActionContext(context).update(data, where, options)
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  async insertOrUpdate (context: ActionContext, payload: Payloads.InsertOrUpdate): Promise<EntityCollection> {
    const state = context.state
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    return (new Query(state, entity)).setActionContext(context).insertOrUpdate(data, options)
  },

  /**
   * Delete data from the store.
   */
  async delete (context: ActionContext, payload: Payloads.Delete): Promise<Item | Collection> {
    const state = context.state
    const entity = payload.entity
    const where = payload.where

    return (new Query(state, entity)).setActionContext(context).delete(where)
  },

  /**
   * Delete all data from the store.
   */
  async deleteAll (context: ActionContext, payload?: Payloads.DeleteAll): Promise<void> {
    const entity = payload ? payload.entity : undefined

    return context.commit('deleteAll', { entity })
  }
}

export default RootActions
