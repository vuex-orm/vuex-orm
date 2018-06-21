import * as Vuex from 'vuex'

export interface Modules {
  [name: string]: Vuex.Module<any, any>
}

export default Modules
