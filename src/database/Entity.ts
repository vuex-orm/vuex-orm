import * as Vuex from 'vuex'
import BaseModel from '../model/BaseModel'

export interface Entity {
  name: string
  model: typeof BaseModel
  module: Vuex.Module<any, any>
}

export default Entity
