import * as _ from 'lodash'
import Vuex from 'vuex'
import Container from '../../connections/Container'
import Database from '../../Database'
import Model from '../../Model'

export interface Entity {
  model: typeof Model
  module?: Vuex.Module<any, any>
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

export default {
  createApplication
}
