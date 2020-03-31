import { Condition } from '../payloads/Actions'
import PrimaryKey from '../../query/options/PrimaryKey'
import PersistOptions from '../../query/options/PersistOptions'

export type Create = PersistOptions

export type Insert = PersistOptions

export interface Update extends PersistOptions {
  where?: PrimaryKey | Condition | null
}

export type InsertOrUpdate = PersistOptions
