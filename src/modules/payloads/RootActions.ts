import { Record } from '../../data'
import PersistOptions from './PersistOptions'

export type Condition = (record: Record) => boolean

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
  where: string | number | Condition
}

export interface DeleteAll {
  entity: string
}
