import { Record } from '../../data'
import Predicate from '../../query/contracts/Predicate'
import PersistOptions from '../../query/options/PersistOptions'

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

export type DeleteById = string | number | Array<number | string>

export type DeleteByCondition = Predicate
