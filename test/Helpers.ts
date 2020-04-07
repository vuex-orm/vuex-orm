import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VuexORM, { Database, Model, RootState, Records } from '@/index'

Vue.use(Vuex)

interface Entities {
  [name: string]: Records
}

export function createStore(models: typeof Model[]): Store<any> {
  const database = new Database()

  models.forEach((model) => {
    database.register(model)
  })

  return new Store({
    plugins: [VuexORM.install(database)],
    strict: true
  })
}

export function createState(entities: Entities): RootState {
  const state = {} as RootState

  for (const entity in entities) {
    state[entity] = { data: {} }

    state[entity].data = entities[entity]
  }

  return state
}

export function assertState(store: Store<any>, entities: Entities): void {
  expect(store.state.entities).toEqual(createState(entities))
}
