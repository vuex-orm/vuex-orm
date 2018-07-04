import { Record } from '../../data'
import PersistOptions from './PersistOptions'

export type Condition = (record: Record) => boolean

export interface Create extends PersistOptions {
  data: Record | Record[]
}

export interface Insert extends PersistOptions {
  data: Record | Record[]
}

export type Update = UpdateObject | Record[]

export interface UpdateObject extends PersistOptions {
  data?: Record | Record[]
  where?: string | number | Condition
  [key: string]: any
}

export interface InsertOrUpdate extends PersistOptions {
  data: Record | Record[]
}

export type Delete = string | number | Condition | DeleteObject

export interface DeleteObject {
  where: string | number
}
