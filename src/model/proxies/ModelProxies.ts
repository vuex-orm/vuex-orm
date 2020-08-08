import Model from "../Model"

class ModelHandler {
  localMap: Map<any, any>

  /**
   * Constructor
   * @param localMap
   */
  constructor(localMap: object = {}) {
    this.localMap = this['localMap'] || new Map()

    for (const key in localMap) {
      if (!localMap.hasOwnProperty(key)) {
        continue
      }

      if (typeof this[key] !== 'function') {
        continue
      }

      this.localMap.set(key, Object.assign({
        model: null,
        key: null
      }, localMap[key]))
    }
  }

  /**
   * Get local properties or proxy to the Model
   * @param target
   * @param objectKey
   */
  get(target: any, objectKey: PropertyKey): any {
    if (objectKey === "isProxy") {
      return true
    }

    if ([...this.localMap.keys()].includes(objectKey) && typeof this[objectKey] === 'function') {
      return this[objectKey](objectKey)
    }

    const prop = target[objectKey]

    if (typeof prop === "undefined") {
      return
    }

    if (prop !== null && !prop.isProxy && typeof prop === "object") {
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

class PivotModelHandler extends ModelHandler {
  /**
   * Query for the actual pivot record against the pivotTable
   * @param objectKey
   * @returns {Model|null}
   */
  pivot(objectKey: string): Model | null {
    const pivot = this.localMap.get(objectKey)

    if (!(pivot.model instanceof Model)) {
      return null
    }

    return pivot.key ? pivot.model.find(pivot.key) : null
  }
}

export class PivotModel {
  constructor(model: any, pivotKey: any, pivotClass: any, pivotProperty: string) {
    const pivotKeyModelMap = {
      [pivotProperty]: {
        model: pivotClass,
        key: pivotKey
      }
    }

    return new Proxy(model, new PivotModelHandler(pivotKeyModelMap))
  }
}
