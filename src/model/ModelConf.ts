export default class ModelConf {
  /**
   * The host/domain of api server
   */
  public baseUrl: string = ''
  /**
   * The endpoint of model entity
   */
  public endpointPath: string = ''
  /**
   * The methods of model
   */
  private _methods: Map<string, MethodConf> = new Map<string, MethodConf>()

  /**
   * Create a model's configuration from json
   * @param {JsonModelConf} jsonConfig the json model's configuration
   */
  constructor (conf?: JsonModelConf) {
    if (conf) {
      this.baseUrl = conf.baseUrl
      this.endpointPath = conf.endpointPath
      conf.methods.forEach((method: MethodConf) => {
        this._methods.set(method.name, new MethodConf(method))
      })
    }
  }

  public extend (conf: JsonModelConf) {
    if (conf.baseUrl) {
      this.baseUrl = conf.baseUrl
    }
    if (conf.endpointPath) {
      this.endpointPath = conf.endpointPath
    }
    if (conf.methods && conf.methods.length) {
      conf.methods.forEach((method: MethodConf) => {
        const _method = this._methods.get(method.name)
        if (_method) {
          _method.assign(method)
        }
        /* tslint:disable */ 
        else {
          this._methods.set(method.name, new MethodConf(method))
        }
      })
    }
  }

  /**
   * Get a method by name or alias
   * @param {string} name the method's name to find
   * @return {MethodConf | undefined} return the method fint
   */
  public method (name: string): MethodConf | undefined {
    let _method
    this._methods.forEach(
      (method: MethodConf, key: string) => {
        if((method.alias && method.alias.indexOf(name) > -1) || key === name) {
          _method = method
        }
      }
    )
    if(!_method) {
      throw new Error(`${name}: method configuration not found`)
    }
    
    return _method
  }

  /**
   * Add a model method
   * @param name the method name
   * @param method the method conf
   */
  public addMethodConf (name: string, method: MethodConf): void {
    this._methods.set(name, method)
  }
}

export interface JsonModelConf {
  baseUrl: string,
  endpointPath: string,
  methods: MethodConf[]
}

export class MethodConf {
  /**
   * The method's name
   */
  public name: string
  /**
   * The method's name
   */
  public alias?: string[]
  /**
   * The bolean for indicate that operation
   */
  public refreshFromApi?: boolean
  /**
   * The bolean for indicate that operation
   */
  public applyToApi?: boolean
  /**
   * The method's http configuration
   */
  public http: HttpConf

  /**
   * Constructor
   * @constructor
   * @param {MethodConf} 
   */
  constructor (
    {
      name, 
      alias = undefined, 
      refreshFromApi = undefined, 
      applyToApi = undefined, 
      http
    }: MethodConf
  ) {
    this.name = name
    this.alias = alias
    this.refreshFromApi = refreshFromApi
    this.applyToApi = applyToApi
    this.http = new HttpConf(http)
  }

  /**
   * Assign the new conf for the method
   * @param {MethodConf}
   */
  assign (
    {
      name            = this.name,
      alias           = this.alias,
      refreshFromApi  = this.refreshFromApi, 
      applyToApi      = this.applyToApi, 
      http            = this.http
    }: MethodConf
  ) {
    this.name = name
    this.alias = alias
    this.refreshFromApi = refreshFromApi
    this.applyToApi = applyToApi
    this.http = new HttpConf(http)
  }
}

export enum HttpMethod {
    GET = 'get',
    HEAD = 'head',
    POST = 'post',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete'
}

export class HttpConf {
  /**
   * The http path
   */
  private readonly _path: string
  /**
   * The http method
   */
  private readonly _method: HttpMethod

  /**
   * @constructor
   * @param {HttpConf} 
   */
  constructor ({path, method}: HttpConf) {
    this._path = path
    this._method = method
  }

  /**
   * @return {string} return a http path
   */
  public get path (): string {
    return this._path
  }
  /**
   * @return {HttpMethod} return a http method
   */
  public get method (): HttpMethod {
    return this._method
  }
}

export const defaultConf = {
  "baseUrl": "http://localhost:3000",
  "endpointPath": "/{self}",
  "methods": [
    {
      "name": "find",
      "alias": ["fetch", "refresh"],
      "refreshFromApi": true,
      "http": {
          "path": "",
          "method": "get"
      }
    },
    {
      "name": "findById",
      "alias": ["fetchById", "refreshById"],
      "refreshFromApi": true,
      "http": {
          "path": "/:id",
          "method": "get"
      }
    },
    {
      "name": "exist",
      "refreshFromApi": true,
      "http": {
          "path": "/exist/:id",
          "method": "get"
      }
    },
    {
      "name": "count",
      "refreshFromApi": true,
      "http": {
          "path": "/count",
          "method": "get"
      }
    },
    {
      "name": "create",
      "applyToApi": true,
      "http": {
          "path": "",
          "method": "post"
      }
    },
    {
      "name": "update",
      "applyToApi": true,
      "http": {
          "path": "/:id",
          "method": "put"
      }
    },
    {
      "name": "delete",
      "applyToApi": true,
      "http": {
          "path": "",
          "method": "delete"
      }
    },
    {
      "name": "deleteById",
      "applyToApi": true,
      "http": {
          "path": "/:id",
          "method": "delete"
      }
    }
  ]
}
