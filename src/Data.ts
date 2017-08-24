import { normalize, Schema } from 'normalizr'

export interface Records {
  [key: string]: any
}

export interface NormalizedData {
  [key: string]: Records
}

export default class Data {
  /**
   * Normalize the given data by given schema.
   */
  static normalize (data: any, schema: Schema): NormalizedData {
    return normalize(data, schema).entities
  }
}
