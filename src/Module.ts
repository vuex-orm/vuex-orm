import * as Vuex from 'vuex'
import * as _ from './support/lodash'
import Model from './Model'
import rootGetters from './modules/rootGetters'
import rootActions from './modules/rootActions'
import mutations from './modules/mutations'
import subGetters from './modules/subGetters'
import subActions from './modules/subActions'

export interface Entity {
  model: typeof Model
  module: Vuex.Module<any, any>
}

export interface State {
  name: string
  [key: string]: any
}

export interface EntityState {
  $connection: string
  $name: string
  data: { [key: string]: any }
  [key: string]: any
}

export default class Module {
  /**
   * The default state. This state will be merged with additional
   * entity's state if it has any.
   */
  static state: EntityState = {
    $connection: '',
    $name: '',
    data: {}
  }

  /**
   * Creates module from the given entities.
   */
  static create (namespace: string, entities: Entity[]): Vuex.Module<any, any> {
    const tree: Vuex.Module<any, any> = {
      namespaced: true,
      state: { name: namespace },
      getters: rootGetters,
      actions: rootActions,
      mutations,
      modules: {}
    }

    return this.createTree(tree, namespace, entities)
  }

  /**
   * Creates module tree to be registered under top level module
   * from the given entities.
   */
  static createTree (tree: any, namespace: string, entities: Entity[]): Vuex.Module<any, any> {
    _.forEach(entities, (entity) => {
      tree.getters[entity.model.entity] = (_state: any, getters: any) => (wrap: boolean = true) => {
        return getters.query(entity.model.entity, wrap)
      }

      tree.modules[entity.model.entity] = {
        namespaced: true,
        state: {
          ...entity.module.state,
          ...this.state,
          $connection: namespace,
          $name: entity.model.entity
        }
      }

      tree.modules[entity.model.entity]['getters'] = {
        ...subGetters,
        ...entity.module.getters
      }

      tree.modules[entity.model.entity]['actions'] = {
        ...subActions,
        ...entity.module.actions
      }

      tree.modules[entity.model.entity]['mutations'] = entity.module.mutations || {}
    })

    return tree
  }
}
