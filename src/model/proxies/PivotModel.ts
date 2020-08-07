class ProxyHandler {
  _pivotMap: Map<any, any>;
  _parentId: number | null = null;

  /**
   * Constructor
   * @param id
   * @param pivotMap
   */
  constructor(id: number | null = null, pivotMap: object = {}) {
    this._parentId = id;
    this._pivotMap = new Map();

    for (const key in pivotMap) {
      if (!pivotMap.hasOwnProperty(key)) {
        continue;
      }

      this._pivotMap.set(key, pivotMap[key])
    }
  }

  /**
   * Get local properties or proxy to the Model
   * @param target
   * @param objectKey
   */
  get(target: any, objectKey: PropertyKey): any {
    if (objectKey === "isProxy") {
      return true;
    }

    if ([...this._pivotMap.keys()].includes(objectKey)) {
      return this[objectKey](target, objectKey);
    }

    const prop = target[objectKey];

    if (typeof prop === "undefined") return;

    if (prop !== null && !prop.isProxy && typeof prop === "object") {
      return new Proxy(prop, {
        get(obj, prop) {
          return obj[prop];
        },
        set(obj, prop, value) {
          obj[prop] = value;
          return true;
        }
      });
    }

    return target[objectKey];
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
    return true;
  }

  /**
   * Query for the actual pivot record against the pivotTable
   *
   * @param target
   * @param objectKey
   * @returns {null|*}
   */
  pivot(target: any, objectKey:string) {
    if (!this._pivotMap.get(objectKey)) {
      return null
    }

    return this._pivotMap.get(objectKey).find([target['id'], this._parentId]);
  }
}

export default class PivotModel {
  constructor(model: any, parentId: number, pivotKey: string, pivotClass: any) {
    const pivotMap = {
      [pivotKey]: pivotClass
    }

    return new Proxy(model, new ProxyHandler(parentId, pivotMap))
  }
}
