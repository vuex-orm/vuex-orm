import Model from '../model/Model'

export interface Record {
  [key: string]: any
}

export interface Records {
  [id: string]: Record
}

export interface NormalizedData {
  [entity: string]: Records
}

export type Item<M extends Model = Model> = M | null

export type Collection<M extends Model = Model> = M[]

export interface Collections {
  [name: string]: Collection<Model>
}
