import { Store } from 'vuex'
import Connection from '../connections/Connection'
import RootState from './contracts/RootState'
import MutationsContract from './contracts/RootMutations'
import * as Payloads from './payloads/RootMutations'

/**
 * Execute generic mutation. This method is used by `Model.commit` method so
 * that user can commit any state changes easily through models.
 */
function $mutate(
  this: Store<any>,
  state: RootState,
  payload: Payloads.$Mutate
): void {
  payload.callback(state[payload.entity])
}

/**
 * Insert the given record.
 */
function insert(this: Store<any>, state: RootState, payload: any): void {
  const { entity, record } = payload
  new Connection(this, state.$name, entity).insert(record)
}

/**
 * Insert the given records.
 */
function insertRecords(this: Store<any>, state: RootState, payload: any): void {
  const { entity, records } = payload
  new Connection(this, state.$name, entity).insertRecords(records)
}

/**
 * Update the given record.
 */
function update(this: Store<any>, state: RootState, payload: any): void {
  const { entity, record, newId } = payload
  new Connection(this, state.$name, entity).update(newId, record)
}

/**
 * Delete records from the store. The actual name for this mutation is
 * `delete`, but named `destroy` here because `delete` can't be declared at
 * this scope level.
 */
function destroy(this: Store<any>, state: RootState, payload: any): void {
  const { entity, id } = payload
  new Connection(this, state.$name, entity).delete(id)
}

const RootMutations: MutationsContract = {
  $mutate,
  insert,
  insertRecords,
  update,
  delete: destroy
}

export default RootMutations
