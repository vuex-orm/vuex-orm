/*eslint-disable */

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search
  }
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement, ...args) {
    let O = Object(this)
    let len = parseInt(O.length, 10) || 0

    if (len === 0) {
      return false
    }

    let n = (args as any)[1] || 0
    let k

    if (n >= 0) {
      k = n
    } else {
      k = len + n

      if (k < 0) {
        k = 0
      }
    }

    let currentElement

    while (k < len) {
      currentElement = O[k]

      if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) {
        return true
      }

      k++
    }

    return false
  }
}

if (!Object.values || !Object.entries) {
  const reduce = Function.bind.call(Function.call as any, Array.prototype.reduce)
  const isEnumerable = Function.bind.call(Function.call as any, Object.prototype.propertyIsEnumerable)
  const concat = Function.bind.call(Function.call as any, Array.prototype.concat)
  const keys = Reflect.ownKeys

  if (!Object.values) {
    (Object.values as any) = function values (O: any) {
      return reduce(keys(O), (v: any, k: any) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
    }
  }

  if (!Object.entries) {
    (Object.entries as any) = function entries (O: any) {
      return reduce(keys(O), (e: any, k: any) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), [])
    }
  }
}
