import Vue from 'vue'
import Vuex, { Store, Module } from 'vuex'
import VuexORM from '@/index'
import { mapValues } from '@/support/Utils'
import Database from '@/database/Database'
import Model from '@/model/Model'
import State from '@/modules/contracts/State'

Vue.use(Vuex)

export interface Entities {
  model: typeof Model
  module?: Module<State, any>
}

/**
 * Check if the given model is model object.
 */
function isModel (model: any): model is typeof Model {
  return model.prototype !== undefined
}

/**
 * Create a new store instance.
 */
export function createStore (entities: Entities[] | typeof Model[], namespace: string = 'entities'): Store<any> {
  const database = new Database()

  entities.forEach((entity: Entities | typeof Model) => {
    isModel(entity) ? database.register(entity) : database.register(entity.model, entity.module)
  })

  return new Store({
    plugins: [VuexORM.install(database, { namespace })],
    strict: true
  })
}

/**
 * Create a new store instance from the given database.
 */
export function createStoreFromDatabase (database: Database): Store<any> {
  return new Store({
    plugins: [VuexORM.install(database)],
    strict: true
  })
}

/**
 * Create a new entity state.
 */
export function createState (state: Record<string, any>, namespace: string = 'entities') {
  return {
    $name: namespace,
    ...mapValues(state, (data, name) => ({
      $connection: namespace,
      $name: name,
      data
    }))
  }
}

export default {
  createStore,
  createStoreFromDatabase,
  createState
}
