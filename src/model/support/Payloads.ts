import { isArray } from '../../support/Utils'
import { Record } from '../../data'
import { PersistOptions } from '../../query/options'

export interface InsertObject extends PersistOptions {
  data: Record | Record[]
}

export interface InsertPayload {
  data: Record | Record[]
  options?: PersistOptions
}

/**
 * Normalize the payload arguments for persist methods. It's required for
 * backward compatibility for the new persist method argument structure.
 * It may be deprecated and be removed in the future.
 */
export function normalizeInsertPayload(
  data: Record | Record[] | InsertObject,
  options?: PersistOptions
): InsertPayload {
  // If the data is an array, then the data should be an array of data.
  // Therefore the whole payload should be passed directly as `data`.
  if (isArray(data)) {
    return { data, options }
  }

  // If the data doesn't have a `data` property, it can be assumed that the
  // user has passed an object as the payload. Therefore the entire payload
  // should be declared as `data`.
  if (data.data === undefined) {
    return { data, options }
  }

  // If the data contains `data` property, we should extract it and pass that
  // property as `data`.
  return { data: data.data, options: data }
}
