import { normalize, Schema } from 'normalizr'

export interface Record {
  [key: string]: any
}

export interface Records {
  [id: string]: Record
}

export interface NormalizedData {
  [entity: string]: Records
}

export default class Data {
  /**
   * Normalize the given data by given schema.
   */
  static normalize (data: any, schema: Schema): NormalizedData {
    return normalize(data, schema).entities
  }
}
