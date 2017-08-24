import * as _ from 'lodash'
import Vuex from 'vuex'
import Model from './Model'

export interface Entity {
  model: typeof Model
  module: Vuex.Module<any, any>
}

export interface State {
  data: {}
  [key: string]: any
}

export default class Module {
  /**
   * The default state. This state will be merged with additional
   * entity's state if it has any.
   */
  static state: State = {
    data: {}
  }

  /**
   * Creates module from given models.
   */
  static create (entities: Entity[]): Vuex.Module<any, any> {
    return {
      namespaced: true,
      modules: this.createTree(entities)
    }
  }

  /**
   * Creates module tree to be registered under top level module
   * from given model.
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
