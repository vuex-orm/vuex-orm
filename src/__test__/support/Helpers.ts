import * as sinon from 'sinon'
import * as _ from 'lodash'
import * as Vuex from 'vuex'
import VuexORM from '../..'
import Container from '../../connections/Container'
import Database from '../../Database'
import Model from '../../Model'

declare const require: any

const Vue = require('vue')

Vue.use(Vuex)

export interface Entity {
  model: typeof Model
  module?: Vuex.Module<any, any>
}

export interface ActionContext {
  state?: any
  rootState?: any
  getters?: any
  rootGetters?: any
  dispatch?: any
  commit?: any
}

/**
 * Create whole application.
 */
export function createApplication (namespace: string, entities: Entity[]): Container {
  const database = new Database()

  _.forEach(entities, (entity) => {
    database.register(entity.model, entity.module || {})
  })

  database.registerNamespace(namespace)

  Container.register(namespace, database)

  return Container
}

/**
 * Create a new Vuex Store.
 */
export function createStore (entities: Entity[]): Vuex.Store<any> {
  const database = new Database()

  _.forEach(entities, (entity) => {
    database.register(entity.model, entity.module || {})
  })

  return new Vuex.Store({
    plugins: [VuexORM(database)]
  })
}

/**
 * Get action context that can be passed to action as arugument.
 */
export function actionContext (context: ActionContext = {}): Vuex.ActionContext<any, any> {
  return {
    state: context.state || {},
    rootState: context.rootState || {},
    getters: context.getters || sinon.spy(),
    rootGetters: context.rootGetters || sinon.spy(),
    dispatch: context.dispatch || sinon.spy(),
    commit: context.commit || sinon.spy()
  }
}

export default {
  createApplication,
  actionContext
}
