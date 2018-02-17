import { normalize } from 'normalizr'
import Model from '../model/Model'
import Schema from './Schema'

export interface Record {
  [field: string]: any
}

export interface Records {
  [id: string]: Record
}

export interface NormalizedData {
  [entity: string]: Records
}

export default class Data {
  /**
   * Normalize the given data based on given model.
   */
  static normalize (data: any, model: typeof Model): NormalizedData {
    const schema = Array.isArray(data) ? Schema.many(model) : Schema.one(model)

    return normalize(data, schema).entities
  }
}
