import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from 'app'
import Utils from 'app/support/Utils'
import Container from 'app/connections/Container'
import Database from 'app/database/Database'
import Model from 'app/model/Model'

Vue.use(Vuex)

/**
 * Create whole application.
 */
export function createApplication (namespace, entities) {
  const database = new Database()

  entities.forEach((entity) => {
    database.register(entity.model, entity.module || {})
  })

  database.registerNamespace(namespace)

  Container.register(namespace, database)

  return Container
}

/**
 * Create a new Vuex Store.
 */
export function createStore (entities) {
  const database = new Database()

  entities.forEach((entity) => {
    database.register(entity.model, entity.module || {})
  })

  return new Vuex.Store({
    plugins: [VuexORM.install(database)],
    strict: true
  })
}

/**
 * Create a new Vuex State.
 */
export function createState (namespace, state) {
  return {
    $name: namespace,

    ...Utils.mapValues(state, (data, name) => {
      return {
        $connection: namespace,
        $name: name,
        data
      }
    })
  }
}

export default {
  createApplication,
  createStore,
  createState
}
