import * as _ from 'lodash'
import * as Vuex from 'vuex'
import Model from './Model'
import getters from './modules/getters'
import actions from './modules/actions'
import mutations from './modules/mutations'

export interface Entity {
  model: typeof Model
  module: Vuex.Module<any, any>
}

export interface State {
  name: string
  [key: string]: any
}

export interface EntityState {
  data: {}
  [key: string]: any
}

export default class Module {
  /**
   * The default state. This state will be merged with additional
   * entity's state if it has any.
   */
  static state: EntityState = {
    data: {}
  }

  /**
   * Creates module from the given entities.
   */
  static create (namespace: string, entities: Entity[]): Vuex.Module<any, any> {
    return {
      namespaced: true,
      state: { name: namespace },
      getters,
      actions,
      mutations,

      modules: this.createTree(entities)
    }
  }

  /**
   * Creates module tree to be registered under top level module
   * from the given entities.
   */
  static createTree (entities: Entity[]): Vuex.ModuleTree<any> {
    let tree: Vuex.ModuleTree<any> = {}

    _.forEach(entities, (entity) => {
      tree[entity.model.entity] = {
        namespaced: true,
        state: { ...entity.module.state, ...this.state }
      }

      if (entity.module.getters) {
        tree[entity.model.entity]['getters'] = entity.module.getters
      }

      if (entity.module.actions) {
        tree[entity.model.entity]['actions'] = entity.module.actions
      }

      if (entity.module.mutations) {
        tree[entity.model.entity]['mutations'] = entity.module.mutations
      }
    })

    return tree
  }
}
