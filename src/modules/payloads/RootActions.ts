import { Record } from '../../data'
import Predicate from '../../query/contracts/Predicate'
import PersistOptions from './PersistOptions'

export type Condition = (record: Record) => boolean

export interface New {
  entity: string
}

export interface Create extends PersistOptions {
  entity: string
  data: Record | Record[]
}

export interface Insert extends PersistOptions {
  entity: string
  data: Record | Record[]
}

export interface Update extends PersistOptions {
  entity: string
  data: Record | Record[]
  where?: string | number | Condition
}

export interface InsertOrUpdate extends PersistOptions {
  entity: string
  data: Record | Record[]
}

export interface DeleteById {
  entity: string
  where: string | number
}

export interface DeleteByCondition {
  entity: string
  where: Predicate
}

export interface DeleteAll {
  entity: string
}
