export interface Dictionary<T> {
  [index: string]: T
}

export type DictionaryIterator<T, TResult> = (value: T, key: string, collection: Dictionary<T>) => TResult

export type Predicate<T> = (value: T, key: string) => boolean

/**
 * Check if the given object is empty.
 */
function isEmpty<T> (object: Dictionary<T>): boolean {
  return Object.keys(object).length === 0
}

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property.
 */
export function forOwn<T> (object: Dictionary<T>, iteretee: DictionaryIterator<T, any>): void {
  object = Object(object)

  Object.keys(object).forEach(key => iteretee(object[key], key, object))
}

/**
 * Creates an object composed of the object properties predicate returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 */
export function pickBy<T> (object: Dictionary<T>, predicate: Predicate<T>): Dictionary<T> {
  return Object.keys(object).reduce((records, key) => {
    const value = object[key]

    if (predicate(value, key)) {
      records[key] = value
    }

    return records
  }, {} as Dictionary<T>)
}

export default {
  isEmpty,
  forOwn,
  pickBy
}
