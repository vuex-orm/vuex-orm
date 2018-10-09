import Query from '../query/Query'
import OptionsBuilder from './support/OptionsBuilder'
import RootState from './contracts/RootState'
import MutationsContract from './contracts/RootMutations'
import * as Payloads from './payloads/RootMutations'

const RootMutations: MutationsContract = {
  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (state: RootState, payload: Payloads.Create): void {
    const entity = payload.entity
    const data = payload.data
    const result = payload.result
    const options = OptionsBuilder.createPersistOptions(payload)

    const query = new Query(state, entity)

    query.setResult(result).create(data, options)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (state: RootState, payload: Payloads.Insert): void {
    const entity = payload.entity
    const data = payload.data
    const result = payload.result
    const options = OptionsBuilder.createPersistOptions(payload)

    const query = new Query(state, entity)

    query.setResult(result).insert(data, options)
  },

  /**
   * Update data in the store.
   */
  update (state: RootState, payload: Payloads.Update): void {
    const entity = payload.entity
    const data = payload.data
    const where = payload.where || null
    const result = payload.result
    const options = OptionsBuilder.createPersistOptions(payload)

    const query = new Query(state, entity)

    query.setResult(result).update(data, where, options)
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (state: RootState, payload: Payloads.InsertOrUpdate): void {
    const entity = payload.entity
    const data = payload.data
    const result = payload.result
    const options = OptionsBuilder.createPersistOptions(payload)

    const query = new Query(state, entity)

    query.setResult(result).insertOrUpdate(data, options)
  },

  /**
   * Delete data from the store.
   */
  delete (state: RootState, payload: Payloads.Delete): void {
    const entity = payload.entity
    const where = payload.where
    const result = payload.result

    const query = new Query(state, entity)

    query.setResult(result).delete(where)
  },

  /**
   * Delete all data from the store.
   */
  deleteAll (state: RootState, payload?: Payloads.DeleteAll): void {
    if (payload && payload.entity) {
      (new Query(state, payload.entity)).deleteAll()

      return
    }

    Query.deleteAll(state)
  }
}

export default RootMutations
