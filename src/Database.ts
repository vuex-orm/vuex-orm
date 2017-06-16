import * as _ from 'lodash'
import Vuex from 'vuex'
import VuexModulable from './contracts/VuexModulable'
import Model from './Model'
import Container from './connections/Container'

export default class Database {
  /**
   * The name of the database.
   */
  name: string

  /**
   * The vuex store instance used for this database session.
   */
  store: Vuex.Store<any>

  /**
   * List of entities that structures the database.
   */
  entities: { [name: string]: typeof Model } = {}

  /**
   * Registers the entities.
   */
  register (model: typeof Model): void {
    this.entities[model.entity] = model
  }

  /**
   * Creates Vuex module out of registered entities.
   */
  module (): Vuex.ModuleTree<any> {
    return {
      namespaced: true,
      modules: this.createModules()
    }
  }

  /**
   * Create Vuex modules from registered entities.
   */
  createModules (): Vuex.Module<any, any> {
    return _(this.entities)
      .keyBy((model: typeof Model) => model.entity)
      .mapValues((model: typeof Model) => this.createModule(model))
      .value()
  }

  /**
   * Create single vuex module from the given model.
   */
  createModule (model: typeof Model): Vuex.Module<any, any> {
    return this.registerWorkspace(model, this.composeModule(model))
  }

  /**
   * Register workspace to the given model and creates new modules for the
   * corresponding model.
   */
  registerWorkspace (model: typeof Model, vuexModule: Vuex.Module<any, any>): Vuex.Module<any, any> {
    if (!model.Workspace) {
      return vuexModule
    }

    model.Workspace.Entity = model

    return {
      ...vuexModule,

      modules: { workspace: this.composeModule(model.Workspace) }
    }
  }

  /**
   * Compose vuex module from the given VuexModulable.
   */
  composeModule (vuexModulable: typeof VuexModulable): Vuex.Module<any, any> {
    return {
      namespaced: true,
      state: vuexModulable.state(),
      actions: vuexModulable.actions(),
      mutations: vuexModulable.mutations()
    }
  }

  /**
   * Register vuex store to the database and register the database to the
   * connection container.
   */
  connect (name: string, store: Vuex.Store<any>): void {
    this.name = name
    this.store = store

    this.setConnectionToEntities(name)

    Container.register(this)
  }

  /**
   * Set connection name to each of registered entities. If the connection is
   * already defined within model, it will use that and will not override.
   *
   * This is for convinience purpose. By doing this, the model can
   * automatically have same connection as the database which
   * the model got registered.
   */
  setConnectionToEntities (name: string): void {
    _.forEach(this.entities, (model: typeof Model) => {
      if (model.connection) {
        return
      }

      model.connection = name
    })
  }
}
