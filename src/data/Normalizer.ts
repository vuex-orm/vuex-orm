import * as _ from 'lodash'
import { normalize } from 'normalizr'
import { NormalizableSchema } from '../schema/Schema'
import Model from '../Model'
import * as Data from './Data'

export default class Normalizer {
  /**
   * Normalize data.
   */
  static normalize (data: Data.Data | Data.Data[], model: typeof Model, wrap: boolean = true): Data.NormalizedData {
    const schema: NormalizableSchema = _.isArray(data) ? model.schema(true) : model.schema()

    const normalizedData: any = normalize({ [model.entity]: data }, schema.entity).entities

    return wrap ? this.wrap(normalizedData, schema) : normalizedData
  }

  /**
   * Convert each given normalized entity to model instance.
   */
  static wrap (data: Data.NormalizedData, schema: NormalizableSchema): Data.WrappedNormalizedData {
    return _.mapValues(data, (entities: Data.Data, name: string): Data.WrappedData => {
      return _.mapValues(entities, (entity: any): Model => {
        return new (schema.models[name])(entity, false)
      })
    })
  }
}
