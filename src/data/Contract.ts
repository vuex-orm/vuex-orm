import Model from '../model/Model'

export interface Record {
  [field: string]: any
}

export interface Records {
  [id: string]: Record
}

export interface NormalizedData {
  [entity: string]: Records
}

export type PlainItem = Record | null

export type PlainCollection = Record[]

export type Item = Model | Record | null

export type Collection = (Model | Record)[]
