export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

/**
 * Check if the given array or object is empty.
 */
export function isEmpty(collection: any[] | object): boolean {
  return size(collection) === 0
}

/**
 * Gets the size of collection by returning its length for array-like values
 * or the number of own enumerable string keyed properties for objects.
 */
export function size(collection: any[] | object): number {
  return isArray(collection)
    ? collection.length
    : Object.keys(collection).length
}

/**
 * Creates an object composed of keys generated from the results of running
 * each element of collection through iteratee.
 */
export function groupBy<T>(
  collection: T[],
  iteratee: (record: T) => string
): { [key: string]: T[] } {
  return collection.reduce((records, record) => {
    const key = iteratee(record)

    if (records[key] === undefined) {
      records[key] = []
    }

    records[key].push(record)

    return records
  }, {})
}
