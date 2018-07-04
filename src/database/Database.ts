import * as Vuex from 'vuex'
import Schema from '../schema/Schema'
import Schemas from '../schema/Schemas'
import Model from '../model/Model'
import ModuleBuilder from '../modules/builder/Builder'
import Entity from './Entity'
import Models from './Models'
import Modules from './Modules'

export default class Database {
  /**
   * The Vuex Store instance.
   */
  store!: Vuex.Store<any>

  /**
   * The namespace of the Vuex Store Module where the database is registered.
   */
  namespace!: string

  /**
   * The list of entities to be registered to the Vuex Store. It contains
   * models and modules with its name.
   */
  entities: Entity[] = []

  /**
   * The database schema definition. This schema will be used when normalizing
   * the data before persisting them to the Vuex Store.
   */
  schemas: Schemas = {}

  /**
   * Initialize the database before a user can start using it.
   */
  start (store: Vuex.Store<any>, namespace: string): void {
    this.store = store
    this.namespace = namespace

    this.registerModules()

    this.createSchema()
  }

  /**
   * Register a model and module to the entities list.
   */
  register (model: typeof Model, module: Vuex.Module<any, any>): void {
    this.entities.push({
      name: model.entity,
      model,
      module
    })
  }

  /**
   * Get the model of the given name from the entities list.
   */
  model (name: string): typeof Model {
    return this.models()[name]
  }

  /**
   * Get all models from the entities list.
   */
  models (): Models {
    return this.entities.reduce((models, entity) => {
      models[entity.name] = entity.model

      return models
    }, {} as Models)
  }

  /**
   * Get the module of the given name from the entities list.
   */
  module (name: string): Vuex.Module<any, any> {
    return this.modules()[name]
  }

  /**
   * Get all modules from the entities list.
   */
  modules (): Modules {
    return this.entities.reduce((modules, entity) => {
      modules[entity.name] = entity.module

      return modules
    }, {} as Modules)
  }

  /**
   * Create the Vuex Module from registered entities.
   */
  registerModules (): void {
    const modules = ModuleBuilder.create(this.namespace, this.modules())

    this.store.registerModule(this.namespace, modules)
  }

  /**
   * Create the schema definition from registered entities list and set
   * it to the property. This schema will be used by the normalizer
   * to normalize data before persisting them to the Vuex Store.
   */
  createSchema (): void {
    this.entities.forEach((entity) => {
      this.schemas[entity.name] = Schema.create(entity.model)
    })
  }
}
