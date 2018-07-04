import * as Vuex from 'vuex'
import State from '../modules/contracts/State'

export interface Modules {
  [name: string]: Vuex.Module<State, any>
}

export default Modules
