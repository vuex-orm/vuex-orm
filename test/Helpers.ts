import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VuexORM, {
  Element,
  Elements,
  Collection,
  Database,
  Model,
  RootState,
  State
} from '@/index'

Vue.use(Vuex)

interface Entities {
  [name: string]: Elements
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

export function fillState(store: Store<any>, entities: Entities): void {
  for (const entity in entities) {
    store.commit(`entities/${entity}/mutate`, (state: State): void => {
      state.data = entities[entity]
    })
  }
}

export function assertState(store: Store<any>, entities: Entities): void {
  expect(store.state.entities).toEqual(createState(entities))
}

export function assertModel<M extends Model>(model: M, record: Element): void {
  expect(model.$toJson()).toEqual(record)
}

export function assertModels<M extends Model>(
  models: Collection<M>,
  record: Element[]
): void {
  models.forEach((model, index) => {
    expect(model.$toJson()).toEqual(record[index])
  })
}

export function assertInstanceOf(
  collection: Collection<any>,
  model: typeof Model
): void {
  collection.forEach((item) => {
    expect(item).toBeInstanceOf(model)
  })
}
