import * as _ from 'lodash'
import Container from './connections/Container'
import { State } from './Module'
import { NormalizedData } from './Data'

export default class Repo {
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

    return Container.connection(state.name).model(name).normalize(data[name])
  }
}
