import Record from '../../data/Record'
import Result from '../../query/contracts/Result'
import PersistOptions from './PersistOptions'

export type Condition = (record: Record) => boolean

export interface Create extends PersistOptions {
  entity: string
  data: Record | Record[]
  result: Result
}

export interface Insert extends PersistOptions {
  entity: string
  data: Record | Record[]
  result: Result
}

export interface Update extends PersistOptions {
  entity: string
  data: Record | Record[]
  where?: string | number | Condition
  result: Result
}

export interface InsertOrUpdate extends PersistOptions {
  entity: string
  data: Record | Record[]
  result: Result
}

export interface Delete {
  entity: string
  where: string | number | Condition
  result: Result
}

export interface DeleteAll {
  entity: string
}
