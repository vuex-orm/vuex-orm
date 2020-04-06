import { Record, Records } from '../../data'
import Predicate from '../../query/contracts/Predicate'
import PersistOptions from '../../query/options/PersistOptions'
import State from '../contracts/State'

export type Condition = (record: Record) => boolean

export interface $Mutate {
  entity: string
  callback: (state: State) => void
}

export interface New {
  entity: string
  data: Records
}

export interface Insert {
  entity: string
  data: Records
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
