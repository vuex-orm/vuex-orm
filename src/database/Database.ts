import { Store, Module as VuexModule } from 'vuex'
import { ConstructorOf } from '../types'
import Model from '../model/Model'
import RootModule from '../modules/RootModule'
import Module from '../modules/Module'
import State from '../modules/State'

interface Models {
  [name: string]: ConstructorOf<Model>
}

export default class Database {
  /**
   * The store instance.
   */
  store!: Store<any>

  /**
   * The name of Vuex Module namespace. Vuex ORM will create Vuex Modules from
   * the registered models and modules and define them under this namespace.
   */
  connection!: string

  /**
   * The list of registered models.
   */
  models: Models = {}

  /**
   * Whether the database has already been installed to Vuex or not.
   * The model registration steps depend on its value.
   */
  started: boolean = false

  /**
   * Register the given model.
   */
  register(model: ConstructorOf<Model>): void {
    const m = new model()

    this.models[m.entity] = model
  }

  /**
   * Connect the store.
   */
  connectStore(store: Store<any>): this {
    this.store = store

    return this
  }

  /**
   * Set the connection.
   */
  setConnection(connection: string): this {
    this.connection = connection

    return this
  }

  /**
   * Initialize the database before a user can start using it.
   */
  start(): void {
    this.registerModules()

    this.started = true
  }

  /**
   * Generate modules and register them to the store.
   */
  private registerModules(): void {
    this.store.registerModule(this.connection, this.createModule())
  }

  /**
   * Create modules from the registered models and modules.
   */
  private createModule(): VuexModule<any, any> {
    const module = this.createRootModule()

    for (const name in this.models) {
      module.modules[name] = this.createSubModule()
    }

    return module
  }

  /**
   * Create root module.
   */
  private createRootModule(): RootModule {
    return {
      namespaced: true,
      modules: {}
    }
  }

  /**
   * Create sub module.
   */
  private createSubModule(): Module {
    return {
      namespaced: true,
      state: this.createSubState()
    }
  }

  /**
   * Create sub state.
   */
  private createSubState(): State {
    return {
      data: {}
    }
  }
}
