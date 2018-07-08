import { replaceAll, clone } from '../support/Utils'
export interface JsonModelConf {
  baseURL?: string,
  endpointPath: string,
  methods?: MethodConf[]
}
export enum HttpMethod {
  GET = 'get',
  HEAD = 'head',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export class PathParam {
  public name: string
  public value: string

  constructor (name: string, value: string) {
    this.value = value
    this.name = name
  }
}

export default class ModelConf {
  /**
   * The host/domain of api server
   */
  public baseURL: string | undefined = ''
  /**
   * The endpoint of model entity
   */
  public endpointPath: string = ''
  /**
   * The methods of model
   */
  public methods: Map<string, MethodConf> = new Map<string, MethodConf>()

  /**
   * Create a model's configuration from json
   * @param {JsonModelConf} jsonConfig the json model's configuration
   */
  constructor (conf?: JsonModelConf) {
    if (conf) {
      this.baseURL = conf.baseURL
      this.endpointPath = conf.endpointPath
      if(conf.methods) {
        conf.methods.forEach((method: MethodConf) => {
          this.methods.set(method.name, new MethodConf(method))
        })
      }
    }
  }

  /**
   * Extend a current model's conf with the conf pass
   * @param {JsonModelConf} conf a json model's conf
   */
  public extend (conf: JsonModelConf): void {
    if (conf.baseURL) {
      this.baseURL = conf.baseURL
    }
    if (conf.endpointPath) {
      this.endpointPath = conf.endpointPath
    }
    if (conf.methods && conf.methods.length) {
      conf.methods.forEach((method: MethodConf) => {
        const _method = this.methods.get(method.name)
        if (_method) {
          _method.assign(method)
        }
        /* tslint:disable */ 
        else {
          this.methods.set(method.name, new MethodConf(method))
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
    this.methods.forEach(
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
    this.methods.set(name, method)
  }
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
   * The boolean for indicate a api comunication
   */
  public remote?: boolean
  /**
   * The boolean for indicate a local sync
   */
  public localSync?: boolean
  /**
   * The method's http configuration
   */
  public http?: HttpConf

  /**
   * Constructor
   * @constructor
   * @param {MethodConf} 
   */
  constructor (
    {
      name, 
      alias = undefined, 
      remote = undefined, 
      localSync = undefined, 
      http
    }: MethodConf
  ) {
    this.name = name
    this.alias = alias
    this.remote = remote
    this.localSync = localSync
    this.http = http && new HttpConf(http)
  }

  /**
   * Assign the new conf for the method
   * @param {MethodConf}
   */
  public assign (
    {
      name            = this.name,
      alias           = this.alias,
      remote          = this.remote, 
      localSync       = this.localSync, 
      http            = this.http
    }: MethodConf
  ): void {
    this.name = name
    this.alias = alias
    this.remote = remote
    this.localSync = localSync
    this.http = http &&new HttpConf(http)
  }
}

export class HttpConf {
  /**
   * The http path
   */
  public path: string
  /**
   * The http method
   */
  public method: HttpMethod

  /**
   * @constructor
   * @param {HttpConf} 
   */
  constructor ({path, method}: HttpConf) {
    this.path = path
    this.method = method
  }

  /**
   * Bind a path param name with the pass value 
   * @param {PathParam[]} params array 
   * @return {string} path with bind params
   */
  public bindPathParams(params: PathParam[]): string {
    let _path = clone(this.path)
    params.forEach(param => {
      _path = replaceAll(_path, `:${param.name}`, param.value)
    })
    return _path
  }
}

export const defaultConf = {
  "baseURL": "http://localhost:3000",
  "endpointPath": "/{self}",
  "methods": [
    {
      "name": "find",
      "alias": ["fetch"],
      "remote": true,
      "localSync": true,
      "http": {
          "path": "",
          "method": "get"
      }
    },
    {
      "name": "findById",
      "alias": ["fetchById"],
      "remote": true,
      "localSync": true,
      "http": {
          "path": "/:id",
          "method": "get"
      }
    },
    {
      "name": "exist",
      "remote": true,
      "http": {
          "path": "/exist/:id",
          "method": "get"
      }
    },
    {
      "name": "count",
      "remote": true,
      "http": {
          "path": "/count",
          "method": "get"
      }
    },
    {
      "name": "create",
      "remote": true,
      "localSync": true,
      "http": {
          "path": "",
          "method": "post"
      }
    },
    {
      "name": "update",
      "remote": true,
      "localSync": true,
      "http": {
          "path": "/:id",
          "method": "put"
      }
    },
    {
      "name": "delete",
      "remote": true,
      "localSync": true,
      "http": {
          "path": "",
          "method": "delete"
      }
    },
    {
      "name": "deleteById",
      "remote": true,
      "localSync": true,
      "http": {
          "path": "/:id",
          "method": "delete"
      }
    }
  ]
}
