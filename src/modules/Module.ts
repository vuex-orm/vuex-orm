import * as Vuex from 'vuex'
import Model from '../model/Model'
import rootGetters from './rootGetters'
import rootActions from './rootActions'
import mutations from './mutations'
import subGetters from './subGetters'
import subActions from './subActions'

export interface Entity {
  model: typeof Model
  module: Vuex.Module<any, any>
}

export interface State {
  name: string
  [entity: string]: any
}

export interface EntityState {
  $connection: string
  $name: string
  data: { [id: string]: any }
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
   * Create module from the given entities.
   */
  static create (namespace: string, entities: Entity[]): Vuex.Module<any, any> {
    const tree = {
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
    entities.forEach((entity) => {
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
