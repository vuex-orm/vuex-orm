import { Store } from 'vuex'
import Connection from '../connections/Connection'
import State from './contracts/RootState'
import MutationsContract from './contracts/RootMutations'
import * as Payloads from './payloads/RootMutations'

/**
 * Execute generic mutation. This method is used by `Model.commit` method so
 * that user can commit any state changes easily through models.
 */
function $mutate(
  this: Store<any>,
  state: State,
  payload: Payloads.$Mutate
): void {
  payload.callback(state[payload.entity])
}

/**
 * Commit the given records by `new` method.
 */
function newRecord(state: State, payload: Payloads.New): void {
  const entity = state[payload.entity]
  entity.data = { ...entity.data, ...payload.data }
}

/**
 * Commit the given records by `insert` method.
 */
function insert(state: State, payload: Payloads.Insert): void {
  const entity = state[payload.entity]
  entity.data = { ...entity.data, ...payload.data }
}

/**
 * Insert the given records.
 */
function insertRecords(this: Store<any>, state: State, payload: any): void {
  const { entity, records } = payload
  new Connection(this, state.$name, entity).insertRecords(records)
}

/**
 * Delete records from the store. The actual name for this mutation is
 * `delete`, but named `destroy` here because `delete` can't be declared at
 * this scope level.
 */
function destroy(this: Store<any>, state: State, payload: any): void {
  const { entity, id } = payload
  new Connection(this, state.$name, entity).delete(id)
}

const RootMutations: MutationsContract = {
  $mutate,
  new: newRecord,
  insert,
  insertRecords,
  delete: destroy
}

export default RootMutations
