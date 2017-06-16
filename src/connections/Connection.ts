import * as _ from 'lodash'
import Vuex from 'vuex'
import Database from '../Database'
import Model from '../Model'

export default class Connection {
  /**
   * The database instance.
   */
  database: Database

  /**
   * Create a new connection instance.
   */
  constructor (database: Database) {
    this.database = database
  }

  /**
   * The registered vuex store instance to use with this connection.
   */
  store (): Vuex.Store<any> {
    return this.database.store
  }

  /**
   * The Name space used for current connection.
   */
  namespace (): string {
    return this.database.name
  }

  /**
   * The root of the entities.
   */
  rootEntities (): any {
    return this.store().state[this.namespace()]
  }

  /**
   * The individual entities. This the entities represents each model.
   */
  entities (name: string, rootState?: any): any {
    return rootState ? rootState[this.namespace()][name] : this.rootEntities()[name]
  }

  /**
   * Get all models from the database.
   */
  models (): { [name: string]: typeof Model } {
    return this.database.entities
  }

  /**
   * Get a model from the database.
   */
  model (name: string): typeof Model {
    return this.models()[name]
  }

  /**
   * Save given data to vuex store.
   */
  save (rootState: any, data: any): void {
    _.forEach(data, (entities, name) => {
      const state = this.entities(name, rootState)

      state.data = { ...state.data, ...entities }
    })
  }

  /**
   * Find a entity by given id.
   */
  find (entity: string, id: number): Model | null {
    return this.entities(entity).data[id] || null
  }
}
