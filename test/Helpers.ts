import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import VuexORM, {
  Database,
  Model,
  RootState,
  State,
  Record,
  Records,
  Collection
} from '@/index'

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

export function assertModel<M extends Model>(model: M, record: Record): void {
  expect(model.$getAttributes()).toEqual(record)
}

export function assertModels<M extends Model>(
  models: Collection<M>,
  record: Record[]
): void {
  models.forEach((model, index) => {
    expect(model.$getAttributes()).toEqual(record[index])
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
