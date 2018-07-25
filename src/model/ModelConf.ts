import { replaceAll, clone } from '../support/Utils'
import { HttpConf } from '../http/Http';

export interface JsonModelConf {
  http?: HttpConf,
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
   * The http config
   */
  public http: HttpConf | undefined = undefined
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
      if(conf.methods) {
        conf.methods.forEach((method: MethodConf) => {
          this.methods.set(method.name, new MethodConf(method))
        })
      }
      if (conf.http) {
        this.http = conf.http 
      }
    }
  }

  /**
   * Extend a current model's conf with the conf pass
   * @param {JsonModelConf} conf a json model's conf
   */
  public extend (conf: JsonModelConf): void {
    if (conf.http) {
      this.http = {...this.http, ...conf.http}
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
    this.http = http
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
    this.http = {...this.http, ...http}
  }

  /**
   * Bind a path param name with the pass value 
   * @param {PathParam[]} params array 
   * @return {string} path with bind params
   */
  public bindPathParams(params: PathParam[]): string {
    let _path = ""
    if(this.http && this.http.url) {
      _path = clone(this.http.url)

      params.forEach(param => {
        _path = replaceAll(_path, `:${param.name}`, param.value)
      })
    }
    return _path
  }
}

export const defaultConf = {
  "http": {
    "baseURL": "http://localhost:3000",
    "url": "/{self}",
  },
  "methods": [
    {
      "name": "find",
      "alias": ["fetch"],
      "remote": true,
      "localSync": true,
      "http": {
          "url": "",
          "method": "get"
      }
    },
    {
      "name": "findById",
      "alias": ["fetchById"],
      "remote": true,
      "localSync": true,
      "http": {
          "url": "/:id",
          "method": "get"
      }
    },
    {
      "name": "exist",
      "remote": true,
      "http": {
          "url": "/exist/:id",
          "method": "get"
      }
    },
    {
      "name": "count",
      "remote": true,
      "http": {
          "url": "/count",
          "method": "get"
      }
    },
    {
      "name": "create",
      "remote": true,
      "localSync": true,
      "http": {
          "url": "",
          "method": "post"
      }
    },
    {
      "name": "update",
      "remote": true,
      "localSync": true,
      "http": {
          "url": "/:id",
          "method": "put"
      }
    },
    {
      "name": "delete",
      "remote": true,
      "localSync": true,
      "http": {
          "url": "",
          "method": "delete"
      }
    },
    {
      "name": "deleteById",
      "remote": true,
      "localSync": true,
      "http": {
          "url": "/:id",
          "method": "delete"
      }
    }
  ]
}
