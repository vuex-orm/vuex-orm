import { Store } from 'vuex'
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
function destroy (this: Store<any>, _state: RootState, payload: Payloads.Delete): void {
  const entity = payload.entity
  const where = payload.where

  const result = payload.result

  result.data = (new Query(this.$db(), entity)).delete(where as any)
}

/**
 * Delete all data from the store.
 */
function deleteAll (this: Store<any>, _state: RootState, payload?: Payloads.DeleteAll): void {
  if (payload && payload.entity) {
    (new Query(this.$db(), payload.entity)).deleteAll()

    return
  }

  Query.deleteAll(this.$db())
}

const RootMutations: MutationsContract = {
  /**
   * Execute generic mutation. This method is used by `Model.commit` method so
   * that user can commit any state changes easily through models.
   */
  $mutate (this: Store<any>, state: RootState, payload: Payloads.$Mutate): void {
    payload.callback(state[payload.entity])
  },

  /**
   * Create new data with all fields filled by default values.
   */
  new (this: Store<any>, _state: RootState, payload: Payloads.New): void {
    const entity = payload.entity

    const result = payload.result

    result.data = (new Query(this.$db(), entity)).new()
  },

  /**
   * Save given data to the store by replacing all existing records in the
   * store. If you want to save data without replacing existing records,
   * use the `insert` method instead.
   */
  create (this: Store<any>, _state: RootState, payload: Payloads.Create): void {
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(this.$db(), entity)).create(data, options)
  },

  /**
   * Insert given data to the state. Unlike `create`, this method will not
   * remove existing data within the state, but it will update the data
   * with the same primary key.
   */
  insert (this: Store<any>, _state: RootState, payload: Payloads.Insert): void {
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(this.$db(), entity)).insert(data, options)
  },

  /**
   * Update data in the store.
   */
  update (this: Store<any>, _state: RootState, payload: Payloads.Update): void {
    const entity = payload.entity
    const data = payload.data
    const where = payload.where || null
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(this.$db(), entity)).update(data, where, options)
  },

  /**
   * Insert or update given data to the state. Unlike `insert`, this method
   * will not replace existing data within the state, but it will update only
   * the submitted data with the same primary key.
   */
  insertOrUpdate (this: Store<any>, _state: RootState, payload: Payloads.InsertOrUpdate): void {
    const entity = payload.entity
    const data = payload.data
    const options = OptionsBuilder.createPersistOptions(payload)

    const result = payload.result

    result.data = (new Query(this.$db(), entity)).insertOrUpdate(data, options)
  },

  delete: destroy,
  deleteAll
}

export default RootMutations
