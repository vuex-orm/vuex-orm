
export default class ModelConf {
  /**
   * The host/domain of api server
   */
  private _baseUrl: string = ''
  /**
   * The endpoint of model entity
   */
  private _endpointPath: string = ''
  /**
   * The methods of model
   */
  private _methods: Map<string, Method> = new Map<string, Method>()

  /**
   * Create a model's configuration from json
   * @param {JsonModelConf} jsonConfig the json model's configuration
   */
  constructor (conf?: JsonModelConf) {
    if (conf) {
      this._baseUrl = conf.baseUrl
      this._endpointPath = conf.endpointPath
      conf.methods.forEach((method: Method) => {
        this._methods.set(method.name, new Method(method))
      })
    }
  }

  public extend (conf: JsonModelConf) {
    if (conf.baseUrl) {
      this._baseUrl = conf.baseUrl
    }
    if (conf.endpointPath) {
      this._endpointPath = conf.endpointPath
    }
    if (conf.methods && conf.methods.length) {
      conf.methods.forEach((method: Method) => {
        const _method = this._methods.get(method.name)
        if (_method) {
          _method.assign(method)
        }
        /* tslint:disable */ 
        else {
          this._methods.set(method.name, new Method(method))
        }
      })
    }
  }

  /**
   * Get a method
   * @param {string} name the method's name to find
   * @return {Method | undefined} return the method fint
   */
  public method (name: string): Method | undefined {
    return this._methods.get(name)
  }

  /**
   * Add a model method
   * @param name the method name
   * @param method the method conf
   */
  public addMethod (name: string, method: Method): void {
    this._methods.set(name, method)
  }
  /**
   * Set/Get the baseUrl
   * @param {string} baseUrl the baseUrl to find or set
   * @return {void | string} return the base url for get
   */
  public baseUrl (baseUrl?: string): void | string {
    if (baseUrl) {
      this._baseUrl = baseUrl
    }
    /* tslint:disable */
    else {
      return this._baseUrl
    }
  }

  /**
   * Set/Get the endpointPath
   * @param {string} endpointPath the endpointPath to find or set
   * @return {void | string} return the endpointPath for get
   */
  public path (endpointPath?: string): void | string {
    if (endpointPath) {
      this._endpointPath = endpointPath
    }
    /* tslint:disable */
    else {
      return this._endpointPath
    }
  }
}

export interface JsonModelConf {
  baseUrl: string,
  endpointPath: string,
  methods: Method[]
}

export class Method {
  /**
   * The method's name
   */
  public name: string
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
   * @param {Method} 
   */
  constructor ({name, refreshFromApi = undefined, applyToApi = undefined, http}: Method) {
    this.name = name
    this.refreshFromApi = refreshFromApi
    this.applyToApi = applyToApi
    this.http = new HttpConf(http)
  }

  /**
   * Assign the new conf for the method
   * @param {Method}
   */
  assign (
    {
      name            = this.name, 
      refreshFromApi  = this.refreshFromApi, 
      applyToApi      = this.applyToApi, 
      http            = this.http
    }: Method
  ) {
    this.name = name
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
  "baseUrl": "",
  "endpointPath": "",
  "methods": [
    {
      "name": "find",
      "refreshFromApi": true,
      "http": {
          "path": "/{self}",
          "method": "get"
      }
    },
    {
      "name": "findById",
      "refreshFromApi": true,
      "http": {
          "path": "/{self}/:id",
          "method": "get"
      }
    },
    {
      "name": "exist",
      "refreshFromApi": true,
      "http": {
          "path": "/{self}/exist/:id",
          "method": "get"
      }
    },
    {
      "name": "count",
      "refreshFromApi": true,
      "http": {
          "path": "/{self}/count",
          "method": "get"
      }
    },
    {
      "name": "create",
      "applyToApi": true,
      "http": {
          "path": "/{self}",
          "method": "post"
      }
    },
    {
      "name": "update",
      "applyToApi": true,
      "http": {
          "path": "/{self}/:id",
          "method": "put"
      }
    },
    {
      "name": "delete",
      "applyToApi": true,
      "http": {
          "path": "/{self}",
          "method": "delete"
      }
    },
    {
      "name": "deleteById",
      "applyToApi": true,
      "http": {
          "path": "/{self}/:id",
          "method": "delete"
      }
    }
  ]
}
