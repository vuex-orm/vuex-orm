import { Records } from '../data/Data'
import State from './State'

/**
 * Generic mutation.
 */
function mutate(state: State, callback: (state: State) => void): void {
  callback(state)
}

/**
 * Commit `insert` change to the store.
 */
function insert(state: State, records: Records): void {
  state.data = { ...state.data, ...records }
}

/**
 * Commit `deleteAll` change to the store.
 */
function destroyAll(state: State): void {
  state.data = {}
}

export default {
  mutate,
  insert,
  deleteAll: destroyAll
}
