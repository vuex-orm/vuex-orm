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
 * Commit `update` change to the store.
 */
function update(state: State, records: Records): void {
  state.data = { ...state.data, ...records }
}

/**
 * Commit `delete` change to the store.
 */
function destroy(state: State, ids: string[]): void {
  const data = {}

  for (const id in state.data) {
    if (!ids.includes(id)) {
      data[id] = state.data[id]
    }
  }

  state.data = data
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
  update,
  delete: destroy,
  deleteAll: destroyAll
}
