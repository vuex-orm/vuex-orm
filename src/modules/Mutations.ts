import { Records } from '../data/Data'
import State from './State'

/**
 * Commit `insert` change to the store.
 */
function insert(state: State, records: Records): void {
  state.data = { ...state.data, ...records }
}

export default {
  insert
}
