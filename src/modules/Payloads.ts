import { Record } from '../data'

export type Condition = (record: Record) => boolean)

export interface CreatePayload {
  data: Record | Record[]
  create?: string[]
  insert?: string[]
  update?: string[]
  insertOrUpdate?: string[]
}

export interface InsertPayload {
  data: Record | Record[]
  create?: string[]
  insert?: string[]
  update?: string[]
  insertOrUpdate?: string[]
}

export interface UpdatePayload {
  where?: string | number | Condition
  data?: Record | Record[]
  create?: string[]
  insert?: string[]
  update?: string[]
  insertOrUpdate?: string[]
  [key: string]: any
}

export interface InsertOrUpdatePayload {
  data: Record | Record[]
  create?: string[]
  insert?: string[]
  update?: string[]
  insertOrUpdate?: string[]
}

export type DeletePaylaod = string | number | Condition | DeletePayloadObject

export interface DeletePayloadObject {
  where: string | number
}
