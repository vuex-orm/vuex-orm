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
