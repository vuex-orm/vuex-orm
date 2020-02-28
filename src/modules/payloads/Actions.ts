import { Record } from '../../data'
import Predicate from '../../query/contracts/Predicate'
import PersistOptions from '../../query/options/PersistOptions'

export type Condition = (record: Record) => boolean

export type Create = CreateObject | Record[]

export interface CreateObject extends PersistOptions {
  data?: Record | Record[]
  [key: string]: any
}

export type Insert = InsertObject | Record[]

export interface InsertObject extends PersistOptions {
  data?: Record | Record[]
  [key: string]: any
}

export type Update = UpdateObject | Record[]

export interface UpdateObject extends PersistOptions {
  data?: Record | Record[]
  where?: string | number | Condition
  [key: string]: any
}

export type InsertOrUpdate = InsertOrUpdateObject | Record[]

export interface InsertOrUpdateObject extends PersistOptions {
  data?: Record | Record[]
  [key: string]: any
}

export type DeleteById = string | number | (number | string)[]

export type DeleteByCondition = Predicate
