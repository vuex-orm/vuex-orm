import * as sinon from 'sinon'
import * as _ from 'lodash'
import Vuex from 'vuex'
import Container from '../../connections/Container'
import Database from '../../Database'
import Model from '../../Model'

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
 * Get action context that can be passed to action as arugument.
 */
export function actionContext (context: ActionContext = {}) {
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
