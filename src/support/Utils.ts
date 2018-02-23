export interface Dictionary<T> {
  [index: string]: T
}

export type DictionaryIterator<T, TResult> = (value: T, key: string, collection: Dictionary<T>) => TResult

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property.
 */
export function forOwn<T> (object: Dictionary<T>, iteretee: DictionaryIterator<T, any>) {
  object = Object(object)

  Object.keys(object).forEach((key) => iteretee(object[key], key, object))
}

export default {
  forOwn
}
