import * as Vuex from 'vuex'
import Query from '../query/Query'
import State from './State'

export type RootActions = Vuex.ActionTree<State, any>

const rootActions: RootActions = {
  /**
   * Save new data to the state. It will remove all existing data in the
   * state. If you want to keep existing data while saving new data,
   * use `insert` instead.
   */
  async create (context, { entity, data, create, insert, update, insertOrUpdate }) {
    return (new Query(context.state, entity))
      .setActionContext(context)
      .create(data, { create, insert, update, insertOrUpdate })
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  async insert (context, { entity, data, create, insert, update, insertOrUpdate }) {
    return (new Query(context.state, entity))
      .setActionContext(context)
      .insert(data, { create, insert, update, insertOrUpdate })
  },

  /**
   * Update data in the store.
   */
  async update (context, { entity, where, data, create, insert, update, insertOrUpdate }) {
    return (new Query(context.state, entity))
      .setActionContext(context)
      .update(data, where, { create, insert, update, insertOrUpdate })
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (context, { entity, data, create, insert, update, insertOrUpdate }) {
    return (new Query(context.state, entity))
      .setActionContext(context)
      .insertOrUpdate(data, { create, insert, update, insertOrUpdate })
  },

  /**
   * Delete data from the store.
   */
  delete (context, { entity, where }) {
    return (new Query(context.state, entity)).setActionContext(context).delete(where)
  },

  /**
   * Delete all data from the store.
   */
  deleteAll ({ commit }, payload?) {
    commit('deleteAll', payload)
  }
}

export default rootActions
