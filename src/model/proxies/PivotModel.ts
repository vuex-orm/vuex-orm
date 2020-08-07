class ProxyHandler {
  _localKeys: Map<any, any>;
  _parentId: number | null = null;

  /**
   * Constructor
   * @param id
   * @param localKeys
   */
  constructor(id: number | null = null, localKeys: object = {}) {
    this._parentId = id;
    this._localKeys = (new Map()).set('pivot', null);

    for (const key in localKeys) {
      if (!localKeys.hasOwnProperty(key)) {
        continue;
      }

      this._localKeys.set(key, localKeys[key])
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

    if ([...this._localKeys.keys()].includes(objectKey)) {
      return this[objectKey](target);
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
   * @param target
   * @returns {null|*}
   */
  pivot(target: any) {
    if (!this._localKeys.get('pivot')) {
      return null
    }

    return this._localKeys.get('pivot').find([target['id'], this._parentId]);
  }
}

export default class PivotModel {
  constructor(model: any, parentId: number, pivotClass: any) {
    const localKeys = {
      'pivot': pivotClass
    }

    return new Proxy(model, new ProxyHandler(parentId, localKeys))
  }
}
