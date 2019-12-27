import Record from '../../data/Record'
import Predicate from '../../query/contracts/Predicate'
import State from '../contracts/State'
import PersistOptions from '../../query/options/PersistOptions'

export type Condition = (record: Record) => boolean

export interface $Mutate {
  entity: string
  callback: (state: State) => void
}

export interface New extends PersistOptions {
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

export interface Delete {
  entity: string
  where: string | number | Predicate
}

export interface DeleteAll {
  entity: string
}
