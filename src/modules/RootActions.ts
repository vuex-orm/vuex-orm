import Item from '../data/Item'
import Collection from '../data/Collection'
import Collections from '../data/Collections'
import Model from '../model/Model'
import ActionsContract from './contracts/RootActions'
import ActionContext from './contracts/RootActionContext'
import * as Payloads from './payloads/RootActions'
import Result from './contracts/Result'

const RootActions: ActionsContract = {
  /**
   * Create new data with all fields filled by default values.
   */
  new (context: ActionContext, payload: Payloads.New): Promise<Model> {
    const result: Result = { data: {} }

    context.commit('new', { ...payload, result })

    return result.data
  },

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  async create (context: ActionContext, payload: Payloads.Create): Promise<Collections> {
    const result: Result = { data: {} }

    context.commit('create', { ...payload, result })

    return result.data
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  async insert (context: ActionContext, payload: Payloads.Insert): Promise<Collections> {
    const result: Result = { data: {} }

    context.commit('insert', { ...payload, result })

    return result.data
  },

  /**
   * Update data in the store.
   */
  async update (context: ActionContext, payload: Payloads.Update): Promise<Item | Collection | Collections> {
    const result: Result = { data: {} }

    context.commit('update', { ...payload, result })

    return result.data
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  async insertOrUpdate (context: ActionContext, payload: Payloads.InsertOrUpdate): Promise<Collections> {
    const result: Result = { data: {} }

    context.commit('insertOrUpdate', { ...payload, result })

    return result.data
  },

  /**
   * Delete data from the store.
   */
  async delete (context: ActionContext, payload: Payloads.Delete): Promise<Item | Collection> {
    const result: Result = { data: {} }

    context.commit('delete', { ...payload, result })

    return result.data
  },

  /**
   * Delete all data from the store.
   */
  async deleteAll (context: ActionContext, payload?: Payloads.DeleteAll): Promise<void> {
    if (payload && payload.entity) {
      context.commit('deleteAll', { entity: payload.entity })

      return
    }

    context.commit('deleteAll')
  }
}

export default RootActions
