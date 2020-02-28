import { Condition } from '../payloads/Actions'
import PersistOptions from '../../query/options/PersistOptions'

export type Create = PersistOptions

export type Insert = PersistOptions

export interface Update extends PersistOptions {
  where?: string | number | Condition | null
}

export type InsertOrUpdate = PersistOptions
