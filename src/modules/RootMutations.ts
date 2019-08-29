import Query from '../query/Query'
import OptionsBuilder from './support/OptionsBuilder'
import RootState from './contracts/RootState'
import MutationsContract from './contracts/RootMutations'
import * as Payloads from './payloads/RootMutations'

/**
 * Delete records from the store. The actual name for this mutation is
 * `delete`, but named `destroy` here because `delete` can't be declared at
 * this scope level.
 */
function destroy (state: RootState, payload: Payloads.Delete): void {
  const entity = payload.entity
  const where = payload.where

  const result = payload.result

  result.data = (new Query(state, entity)).delete(where as any)
}

/**
 * Delete all data from the store.
 */
function deleteAll (state: RootState, payload?: Payloads.DeleteAll): void {
  if (payload && payload.entity) {
    (new Query(state, payload.entity)).deleteAll()

    return
  }

  Query.deleteAll(state)
}

const RootMutations: MutationsContract = {
  /**
   * Execute generic mutation. This method is used by `Model.commit` method so
   * that user can commit any state changes easily through models.
   */
  $mutate (state: RootState, payload: Payloads.$Mutate): void {
    payload.callback(state[payload.entity])
  },

  /**
   * Create new data with all fields filled by default values.
   */
  new (state: RootState, payload: Payloads.New): void {
    const entity = payload.entity

    const result = payload.result

    result.data = (new Query(state, entity)).new()
  },

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (state: RootState, payload: Payloads.Create): void {
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(state, entity)).create(data, options)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (state: RootState, payload: Payloads.Insert): void {
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(state, entity)).insert(data, options)
  },

  /**
   * Update data in the store.
   */
  update (state: RootState, payload: Payloads.Update): void {
    const entity = payload.entity
    const data = payload.data
    const where = payload.where || null
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(state, entity)).update(data, where, options)
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (state: RootState, payload: Payloads.InsertOrUpdate): void {
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(state, entity)).insertOrUpdate(data, options)
  },

  delete: destroy,
  deleteAll
}

export default RootMutations
