interface SortableArray<T> {
  criteria: any[]
  index: number
  value: T
}

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
 * Creates an array of elements, sorted in specified order by the results
 * of running each element in a collection thru each iteratee.
 */
export function orderBy<T>(
  collection: T[],
  iteratees: (((record: T) => any) | string)[],
  directions: string[]
): T[] {
  let index = -1

  const result = collection.map((value) => {
    const criteria = iteratees.map((iteratee) => {
      return typeof iteratee === 'function' ? iteratee(value) : value[iteratee]
    })

    return { criteria, index: ++index, value }
  })

  return baseSortBy(result, (object, other) => {
    return compareMultiple(object, other, directions)
  })
}

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order
 * of equal elements.
 */
function baseSortBy<T>(
  array: SortableArray<T>[],
  comparer: (a: SortableArray<T>, B: SortableArray<T>) => number
): T[] {
  let length = array.length

  array.sort(comparer)

  const newArray: T[] = []
  while (length--) {
    newArray[length] = array[length].value
  }
  return newArray
}

/**
 * Used by `orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order.
 * Otherwise, specify an order of "desc" for descending or "asc" for
 * ascending sort order of corresponding values.
 */
function compareMultiple(object: any, other: any, orders: string[]): number {
  let index = -1

  const objCriteria = object.criteria
  const othCriteria = other.criteria
  const length = objCriteria.length

  while (++index < length) {
    const result = compareAscending(objCriteria[index], othCriteria[index])

    if (result) {
      const order = orders[index]

      return result * (order === 'desc' ? -1 : 1)
    }
  }

  return object.index - other.index
}

/**
 * Compares values to sort them in ascending order.
 */
function compareAscending(value: any, other: any): number {
  if (value !== other) {
    const valIsDefined = value !== undefined
    const valIsNull = value === null
    const valIsReflexive = value === value

    const othIsDefined = other !== undefined
    const othIsNull = other === null

    if (typeof value !== 'number' || typeof other !== 'number') {
      value = String(value)
      other = String(other)
    }

    if (
      (!othIsNull && value > other) ||
      (valIsNull && othIsDefined) ||
      !valIsDefined ||
      !valIsReflexive
    ) {
      return 1
    }

    return -1
  }

  return 0
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

/**
 * Deep clone the given target object.
 */
export function cloneDeep<T extends object>(target: T): T {
  if (isArray(target)) {
    const cp = [] as any[]
    ;(target as any[]).forEach((v) => cp.push(v))

    return cp.map((n: any) => cloneDeep<any>(n)) as any
  }

  if (typeof target === 'object' && target !== {}) {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any
    }

    Object.keys(cp).forEach((k) => (cp[k] = cloneDeep<any>(cp[k])))

    return cp as T
  }

  return target
}
