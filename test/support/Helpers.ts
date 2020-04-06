import Vue from 'vue'
import Vuex, { Store, Module } from 'vuex'
import VuexORM from '@/index'
import { mapValues } from '@/support/Utils'
import { Record, Collection } from '@/data'
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
function isModel(model: any): model is typeof Model {
  return model.prototype !== undefined
}

/**
 * Create a new store instance.
 */
export function createStore(
  entities: Entities[] | typeof Model[],
  namespace: string = 'entities'
): Store<any> {
  const database = new Database()

  entities.forEach((entity: Entities | typeof Model) => {
    isModel(entity)
      ? database.register(entity)
      : database.register(entity.model, entity.module)
  })

  return new Store({
    plugins: [VuexORM.install(database, { namespace })],
    strict: true
  })
}

/**
 * Create a new store instance from the given database.
 */
export function createStoreFromDatabase(database: Database): Store<any> {
  return new Store({
    plugins: [VuexORM.install(database)],
    strict: true
  })
}

/**
 * Fill store data with the given state.
 */
export function fillState(store: Store<any>, state: Record): void {
  for (const entity in state) {
    store.commit('entities/$mutate', {
      entity,
      callback(s: State) {
        s.data = state[entity]
      }
    })
  }
}

/**
 * Create a new entity state.
 */
export function createState(state: Record, namespace: string = 'entities') {
  return {
    $name: namespace,
    ...mapValues(state, (data, name) => ({
      $connection: namespace,
      $name: name,
      data
    }))
  }
}

/**
 * Serialize given collection by invoking `$getAttributes` on each model
 * in the given collection.
 */
export function serializeCollection(collection: Collection): Record[] {
  return collection.map((m) => m.$getAttributes())
}

export default {
  createStore,
  createStoreFromDatabase,
  fillState,
  createState,
  serializeCollection
}
