import { Store, Module, MutationTree } from 'vuex'
import { mapValues } from '../support/Utils'
import Schema from '../schema/Schema'
import Schemas from '../schema/Schemas'
import Model from '../model/Model'
import ModuleContract from '../modules/contracts/Module'
import RootState from '../modules/contracts/RootState'
import RootGettersContract from '../modules/contracts/RootGetters'
import RootActionsContract from '../modules/contracts/RootActions'
import RootMutationsContract from '../modules/contracts/RootMutations'
import RootGetters from '../modules/RootGetters'
import RootActions from '../modules/RootActions'
import RootMutations from '../modules/RootMutations'
import State from '../modules/contracts/State'
import GettersContract from '../modules/contracts/Getters'
import ActionsContract from '../modules/contracts/Actions'
import Getters from '../modules/Getters'
import Actions from '../modules/Actions'

export interface Entity {
  name: string
  base: string
  model: typeof Model
  module: Module<any, any>
}

export type Models = Record<string, typeof Model>
export type Modules = Record<string, Module<State, any>>

export default class Database {
  /**
   * The Vuex Store instance.
   */
  store!: Store<any>

  /**
   * The namespace for the Vuex Module. Vuex ORM will create Vuex Modules from the
   * registered models and modules and define them under this namespace.
   */
  namespace!: string

  /**
   * The list of entities. It contains models and modules with its name.
   * The name is going to be the namespace for the Vuex Modules.
   */
  entities: Entity[] = []

  /**
   * The hacked models registered to the store.
   */
  hackedModels: Models = {}

  /**
   * The normalizr schema.
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
  start (store: Store<any>, namespace: string): void {
    this.store = store
    this.namespace = namespace

    this.registerModules()
    this.createSchema()

    this.isStarted = true
  }

  /**
   * Register a model and a module to Database.
   */
  register (model: typeof Model, module: Module<any, any> = {}): void {
    this.checkModelTypeMappingCapability(model)

    const entity: Entity = {
      name: model.entity,
      base: model.baseEntity || model.entity,
      model,
      module
    }

    this.hackedModels[model.entity] = this.createBindingModel(model)

    this.entities.push(entity)

    if (this.isStarted) {
      this.registerModule(entity)
      this.registerSchema(entity)
    }
  }

  /**
   * Get the model of the given name from the entities list.
   */
  model <T extends typeof Model> (model: T): T
  model (model: string): typeof Model
  model (model: typeof Model | string): typeof Model | string {
    const name = typeof model === 'string' ? model : model.entity
    const m = this.models()[name]

    if (!m) {
      throw new Error(
        `[Vuex ORM] Could not find the model \`${name}\`. Please check if you ` +
        'have registered the model to the database.'
      )
    }

    return m
  }

  /**
   * Get the base model of the given name from the entities list.
   */
  baseModel <T extends typeof Model> (model: T): T
  baseModel (model: string): typeof Model
  baseModel (model: typeof Model | string): typeof Model | string {
    const name = typeof model === 'string' ? model : model.entity
    const m = this.baseModels()[name]

    if (!m) {
      throw new Error(
        `[Vuex ORM] Could not find the model \`${name}\`. Please check if you ` +
        'have registered the model to the database.'
      )
    }

    return m
  }

  /**
   * Get all models from the entities list.
   */
  models (): Models {
    return this.entities.reduce<Models>((models, entity) => {
      models[entity.name] = entity.model
      return models
    }, {})
  }

  /**
   * Get all base models from the entities list.
   */
  baseModels (): Models {
    return this.entities.reduce<Models>((models, entity) => {
      models[entity.name] = this.model(entity.base)
      return models
    }, {})
  }

  /**
   * Get the module of the given name from the entities list.
   */
  module (name: string): Module<any, any> {
    const module = this.modules()[name]

    if (!module) {
      throw new Error(
        `[Vuex ORM] Could not find the module \`${name}\`. Please check if you ` +
        'have registered the module to the database.'
      )
    }

    return module
  }

  /**
   * Get all modules from the entities list.
   */
  modules (): Modules {
    return this.entities.reduce<Modules>((modules, entity) => {
      modules[entity.name] = entity.module
      return modules
    }, {})
  }

  /**
   * Get the root state from the store.
   */
  getState (): RootState {
    return this.store.state[this.namespace]
  }

  /**
   * Create a new model that binds the database.
   *
   * Transpiled classes cannot extend native classes. Implemented a workaround
   * until Babel releases a fix (https://github.com/babel/babel/issues/9367).
   */
  private createBindingModel (model: typeof Model): typeof Model {
    let proxy: typeof Model

    try {
      proxy = new Function('model', `
        'use strict';
        return class ${model.name} extends model {}
      `)(model)
    } catch {
      /* istanbul ignore next: rollback (mostly <= IE10) */
      proxy = class extends model {}

      /* istanbul ignore next: allocate model name */
      Object.defineProperty(proxy, 'name', { get: () => model.name })
    }

    Object.defineProperty(proxy, 'store', {
      value: (): Store<any> => this.store
    })

    return proxy
  }

  /**
   * Create Vuex Module from the registered entities, and register to
   * the store.
   */
  private registerModules (): void {
    this.store.registerModule(this.namespace, this.createModule())
  }

  /**
   * Generate module from the given entity, and register to the store.
   */
  private registerModule (entity: Entity): void {
    this.store.registerModule([this.namespace, entity.name], this.createSubModule(entity))
  }

  /**
   * Create Vuex Module from the registered entities.
   */
  private createModule (): Module<any, any> {
    const module = this.createRootModule()

    this.entities.forEach((entity) => {
      module.modules[entity.name] = this.createSubModule(entity)
    })

    return module
  }

  /**
   * Create root module.
   */
  private createRootModule (): ModuleContract {
    return {
      namespaced: true,
      state: this.createRootState(),
      getters: this.createRootGetters(),
      actions: this.createRootActions(),
      mutations: this.createRootMutations(),
      modules: {}
    }
  }

  /**
   * Create root state.
   */
  private createRootState (): () => RootState {
    return () => ({ $name: this.namespace })
  }

  /**
   * Create root getters. For the getters, we bind the store instance to each
   * function to retrieve database instances within getters. We only need this
   * for the getter since actions and mutations are already bound to store.
   */
  private createRootGetters (): RootGettersContract {
    return mapValues(RootGetters, (_getter, name) => {
      return RootGetters[name].bind(this.store)
    })
  }

  /**
   * Create root actions.
   */
  private createRootActions (): RootActionsContract {
    return RootActions
  }

  /**
   * Create root mutations.
   */
  private createRootMutations (): RootMutationsContract {
    return RootMutations
  }

  /**
   * Create sub module.
   */
  private createSubModule (entity: Entity): Module<any, any> {
    return {
      namespaced: true,
      state: this.createSubState(entity),
      getters: this.createSubGetters(entity),
      actions: this.createSubActions(entity),
      mutations: this.createSubMutations(entity)
    }
  }

  /**
   * Create sub state.
   */
  private createSubState (entity: Entity): () => State {
    const { name, model, module } = entity

    const modelState = typeof model.state === 'function' ? model.state() : model.state
    const moduleState = typeof module.state === 'function' ? module.state() : module.state

    return () => ({
      ...modelState,
      ...moduleState,
      $connection: this.namespace,
      $name: name,
      data: {}
    })
  }

  /**
   * Create sub getters.
   */
  private createSubGetters (entity: Entity): GettersContract {
    return { ...Getters, ...entity.module.getters }
  }

  /**
   * Create sub actions.
   */
  private createSubActions (entity: Entity): ActionsContract {
    return { ...Actions, ...entity.module.actions }
  }

  /**
   * Create sub mutations.
   */
  private createSubMutations (entity: Entity): MutationTree<any> {
    return entity.module.mutations ?? {}
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
   * Generate schema from the given entity.
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
      console.warn(
        `[Vuex ORM] Model \`${model.name}\` extends \`${baseModel.name}\` which doesn't ` +
        'overwrite Model.types(). You will not be able to use type mapping.'
      )
    }
  }
}
