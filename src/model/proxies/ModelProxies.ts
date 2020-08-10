import { Record } from '../../data'

class PivotHandler {
  _pivotKey: any
  _pivot: any

  /**
   * Constructor
   * @param pivot
   * @param pivotKey
   */
  constructor(pivot: Record, pivotKey: string) {
    this._pivotKey = pivotKey
    this._pivot = pivot
  }

  /**
   * Get local properties or proxy to the Model
   * @param target
   * @param objectKey
   */
  get(target: any, objectKey: PropertyKey): any {
    if (objectKey === 'isProxy') {
      return true
    }

    if (objectKey === 'pivotKey') {
      return this._pivotKey
    }

    if (this._pivotKey === objectKey) {
      return this._pivot
    }

    const prop = target[objectKey]

    if (typeof prop === 'undefined') {
      return
    }

    if (prop !== null && !prop.isProxy && typeof prop === 'object') {
      return new Proxy(prop, {
        get(obj, prop) {
          return obj[prop]
        },
        set(obj, prop, value) {
          obj[prop] = value
          return true
        }
      })
    }

    return target[objectKey]
  }

  /**
   *  Set property on Model
   * @param target
   * @param objectKey
   * @param value
   * @returns {boolean}
   */
  set(target: any, objectKey: PropertyKey, value: any): boolean {
    target[objectKey] = value
    return true
  }
}

export class PivotModel {
  constructor(model: Record, pivot: Record, pivotKey: string = 'pivot') {
    return new Proxy(model, new PivotHandler(pivot, pivotKey))
  }
}
