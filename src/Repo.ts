import * as _ from 'lodash'
import Container from './connections/Container'
import { Records, NormalizedData } from './Data'
import { State } from './Module'
import Model from './Model'

export type Collection = Model[] | Records[] | null

export default class Repo {
  /**
   * Get all data of the given entity from teh state.
   */
  static all (state: State, entity: string, wrap: boolean = true): Collection {
    const records: Records = state[entity].data

    return wrap ? this.collect(records, this.model(state, entity)) : this.collect(records)
  }

  /**
   * Save the given data to the state. This will replace any existing
   * data in the state.
   */
  static create (state: State, data: any): void {
    const normalizedData: NormalizedData = this.normalize(state, data)

    _.forEach(normalizedData, (data, entity) => {
      state[entity].data = data
    })
  }

  /**
   * Normalize the given data by given model.
   */
  static normalize (state: State, data: any): NormalizedData {
    const name: string = _.keys(data)[0]

    return this.model(state, name).normalize(data[name])
  }

  /**
   * Get model of given name.
   */
  static model (state: State, name: string): typeof Model {
    return Container.connection(state.name).model(name)
  }

  /**
   * Create collection (array) from given records.
   */
  static collect (records: Records, model?: typeof Model): Collection {
    if (_.isEmpty(records)) {
      return null
    }

    if (!model) {
      return _.map(records, record => record)
    }

    return _.map(records, data => new model(data))
  }
}
