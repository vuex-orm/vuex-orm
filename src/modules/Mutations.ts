import { MutationTree } from 'vuex'
import { Elements } from '../data/Data'
import { State } from './State'

export interface Mutations<S extends State> extends MutationTree<S> {
  mutate(state: S, callback: (state: S) => void): void
  insert(state: S, records: Elements): void
  update(state: S, records: Elements): void
  delete(state: S, ids: string[]): void
  deleteAll(state: S): void
}

/**
 * Generic mutation.
 */
function mutate(state: State, callback: (state: State) => void): void {
  callback(state)
}

/**
 * Commit `insert` change to the store.
 */
function insert(state: State, records: Elements): void {
  state.data = { ...state.data, ...records }
}

/**
 * Commit `update` change to the store.
 */
function update(state: State, records: Elements): void {
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

export const mutations = {
  mutate,
  insert,
  update,
  delete: destroy,
  deleteAll: destroyAll
}
