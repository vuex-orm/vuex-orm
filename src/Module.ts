import * as _ from 'lodash'
import * as Vuex from 'vuex'
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
  $connection: string,
  $name: string,
  data: {},
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
    return {
      namespaced: true,
      state: { name: namespace },
      getters: rootGetters,
      actions: rootActions,
      mutations,

      modules: this.createTree(namespace, entities)
    }
  }

  /**
   * Creates module tree to be registered under top level module
   * from the given entities.
   */
  static createTree (namespace: string, entities: Entity[]): Vuex.ModuleTree<any> {
    let tree: Vuex.ModuleTree<any> = {}

    _.forEach(entities, (entity) => {
      tree[entity.model.entity] = {
        namespaced: true,
        state: {
          ...entity.module.state,
          ...this.state,
          $connection: namespace,
          $name: entity.model.entity,
        }
      }

      tree[entity.model.entity]['getters'] = {
        ...subGetters,
        ...entity.module.getters
      } as Vuex.GetterTree<any, any>

      tree[entity.model.entity]['actions'] = {
        ...subActions,
        ...entity.module.actions
      } as Vuex.ActionTree<any, any>

      tree[entity.model.entity]['mutations'] = entity.module.mutations || {}
    })

    return tree
  }
}
