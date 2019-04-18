/*eslint-disable */
import 'core-js/es/reflect/own-keys'
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

if (!Object.values || !Object.entries || !Object.assign) {
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

  if (!Object.assign) {
    (Object.assign as any) = function assign (target: any, _varArgs: any) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }

      const to = Object(target)

      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]

        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    }
  }
}
