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
   * The namespace of the Vuex Store Module where all entities are
   * registered under.
   */
  namespace!: string

  /**
   * The list of entities registered to the Vuex Store. It contains models and
   * modules with its name.
   */
  entities: Entity[] = []

  /**
   * The database schema definition. This schema is going to be used when
   * normalizing the data before persisting them to the Vuex Store.
   */
  schemas: Schemas = {}

  /**
   * Whether the database has already been installed to Vuex or not.
   * Model registration steps depend on its value.
   */
  isStarted: boolean = false

  /**
   * Initialize the database before a user can start using it.
   */
  start (store: Vuex.Store<any>, namespace: string): void {
    this.store = store
    this.namespace = namespace

    this.registerModules()

    this.createSchema()

    this.isStarted = true
  }

  /**
   * Register a model and a module to Database.
   */
  register (model: typeof Model, module: Vuex.Module<any, any> = {}): void {
    this.checkModelTypeMappingCapability(model)

    const entity: Entity = {
      name: model.entity,
      base: model.baseEntity || model.entity,
      model,
      module
    }

    this.entities.push(entity)

    if (this.isStarted) {
      this.registerModule(entity.name)
      this.registerSchema(entity)
    }
  }

  /**
   * Get the model of the given name from the entities list.
   */
  model (name: string): typeof Model {
    return this.models()[name]
  }

  /**
   * Get the base model of the given name from the entities list.
   */
  baseModel (name: string): typeof Model {
    return this.baseModels()[name]
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
   * Get all base models from the entities list.
   */
  baseModels (): Models {
    return this.entities.reduce((models, entity) => {
      models[entity.name] = this.model(entity.base)

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
   * Create the Vuex Module from the registered entities.
   */
  private registerModules (): void {
    const modules = ModuleBuilder.create(this.namespace, this.models(), this.modules())

    this.store.registerModule(this.namespace, modules)
  }

  /**
   * Create the schema definition from registered entities list and set it to
   * the `schema` property. This schema will be used by the normalizer
   * to normalize data before persisting them to the Vuex Store.
   */
  private createSchema (): void {
    this.entities.forEach((entity) => {
      this.registerSchema(entity)
    })
  }

  /**
   * Append entity registered after start
   */
  private registerModule (name: string): void {
    const module = ModuleBuilder.createModule(name, this.namespace, this.model(name), this.module(name))

    this.store.registerModule([ this.namespace, name ], module)
  }

  /**
   * Append schema registered after start
   */
  private registerSchema (entity: Entity): void {
    this.schemas[entity.name] = Schema.create(entity.model)
  }

  /**
   * Warn user if the given model is a type of an inherited model that is being
   * defined without overwriting `Model.types()` because the user will not be
   * able to use the type mapping feature in this case.
   */
  private checkModelTypeMappingCapability (model: typeof Model): void {
    // We'll not be logging any warning if it's on a production environment,
    // so let's return here if it is.
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'production') {
      return
    }

    // If the model doesn't have `baseEntity` property set, we'll assume it is
    // not an inherited model so we can stop here.
    if (!model.baseEntity) {
      return
    }

    // Now it seems like the model is indeed an inherited model. Let's check if
    // it has `types()` method declared, or we'll warn the user that it's not
    // possible to use type mapping feature.

    const baseModel = this.model(model.baseEntity)

    if (baseModel && baseModel.types === Model.types) {
      console.warn(`Model ${model.name} extends ${baseModel.name} which doesn't overwrite Model.types(). You will not be able to use type mapping.`)
    }
  }
}
