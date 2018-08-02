import BaseModel from './BaseModel'
import Http, { HttpConf } from '../http/Http'
import { Record } from '../data'
import Query, { UpdateClosure } from '../query/Query'
import EntityCollection from '../query/EntityCollection'
import { Collection, Item } from '../query'
import ModelConf, {
  JsonModelConf,
  MethodConf,
  defaultConf,
  PathParams
} from '../model/ModelConf'
import ModuleOptions from '../options/Options'
import { replaceAll } from '../support/Utils'

export type UpdateReturn = Item | Collection | EntityCollection

export default class Model extends BaseModel {
  public static _conf: ModelConf | JsonModelConf
  public static _http: Http
  
  /**
  * Configure a model with default conf and extend or override
  * the default configuration with a custom configuration present on
  * model class or on parameter.
  * Priority confs:
  * default -> custom on model class -> custom on conf() parameter
  * @param {parameterConf} parameterConf optionaly a json model's conf
  * @static
  */
  public static conf(parameterConf?: JsonModelConf): void {
    
    // if conf alredy instanced
    if (this._conf instanceof ModelConf) {
      if (parameterConf) {
        this.replaceAllUrlSelf(parameterConf as JsonModelConf)
        this._conf.extend(parameterConf)
      }
    }
    else {
      const _onModelconf = this._conf as JsonModelConf
      let _defaultConf = Object.assign({}, defaultConf)
      _defaultConf.http = { ...defaultConf.http as any, ...ModuleOptions.getDefaultHttpConfig() }
      
      this.replaceAllUrlSelf(_defaultConf as JsonModelConf)
      // instance default conf
      this._conf = new ModelConf(_defaultConf as JsonModelConf)
      
      // check if confs on model are present
      if (_onModelconf) {
        this.replaceAllUrlSelf(_onModelconf as JsonModelConf)
        this._conf.extend(_onModelconf)
      }
    }
    
    if (!(this._http instanceof Http)) {
      this._http = new Http(this._conf.http as HttpConf);
    }
  }
  
  /**
  * Replace all {self} in url params
  * @param {JsonModelConf} conf
  * @static
  */
  private static replaceAllUrlSelf(conf: JsonModelConf): void {
    if (conf.http && conf.http.url) {
      conf.http.url = replaceAll(conf.http.url, '{self}', this.entity)
    }
    
    if (conf.methods && Array.isArray(conf.methods)) {
      conf.methods.forEach((method: MethodConf) => {
        if (method.http && method.http.url) {
          method.http.url = replaceAll(method.http.url, '{self}', this.entity)
        }
      })
    }
  }

  /**
   * Execute http request
   * @param {MethodConf} conf 
   * @param {PathParams} pathParams 
   * @static
   * @async
   * @return {Promise<any>}
   */
  public static async httpRequest(conf: MethodConf, pathParams?: PathParams): Promise<any> {
    conf.http!.url =  this.getUrl(conf, pathParams)
    return await this._http.request(conf.http as HttpConf)
      .catch((err: Error) => { console.log(err) }) || []
  }
  
  /**
  * Fetch data from api server and sync to the local store (optionaly)
  * @param {MethodConf} conf a method's conf
  * @static
  * @async
  * @return {Promise<UpdateReturn>} fetched data
  */
  public static async fetch(
    conf: MethodConf = this.getMethodConf('fetch')
  ): Promise<any> {
    const _conf = this.checkMethodConf('fetch', conf)
    const data = this.httpRequest(_conf)
    if (_conf.localSync) {
      await this.dispatch('insertOrUpdate', { data })
    }
    return data
  }
  
  /**
  * Wrap find method
  * @param {MethodConf} conf a method's conf
  * @static
  * @async
  * @return {Promise<Collection>} list of results
  */
  public static async find(conf: MethodConf = this.getMethodConf('find')): Promise<Collection> {
    const _conf = this.checkMethodConf('find', conf)
    let data
    if (_conf.remote) {
      data = await this.fetch(conf)
    }
    /* tslint:disable */
    else {
      data = this.query().all()
    }
    
    return data
  }
  
  /**
  * Wrap findById method
  * @param {number} id of record to find
  * @param {MethodConf} conf a method's conf
  * @static
  * @return {Promise<Item>} result object
  */
  public static async findById(
    id: number,
    conf: MethodConf = this.getMethodConf('findById')
  ): Promise<Item> {
    const _conf = this.checkMethodConf('findById', conf)
    let data
    if (_conf.remote) {
      data = await this.fetchById(id, conf)
    }
    /* tslint:disable */
    else {
      data = this.query().find(id)
    }
    
    return data
  }
  
  /**
  * Exec a fetchById api method with the default confs 
  * or the pass confs and sync to the local store (optionaly) 
  * @param {number} id of the fetching record
  * @param {MethodConf} conf a method's conf
  * @static
  * @async
  * @return {Promise<Item>} fetched item
  */
  public static async fetchById(
    id: number,
    conf: MethodConf = this.getMethodConf('fetchById')
  ): Promise<Item> {
    const _conf = this.checkMethodConf('fetchById', conf)
    const data = this.httpRequest(_conf, {'id': id.toString()})
    
    if (_conf.localSync) {
      // await this.update(data)
      await this.dispatch('insertOrUpdate', { data })
    }
    return data
  }
  
  /**
  * Check if record identified by id param exist
  * @param {number} id of the record to search
  * @param {MethodConf} conf a method's conf
  * @static
  * @return {Promise<boolean>} the result
  */
  public static async exist(
    id: number,
    conf: MethodConf = this.getMethodConf('exist')
  ): Promise<boolean> {
    const _conf = this.checkMethodConf('exist', conf)
    let data
    
    if (_conf.remote) {
      data = await this.httpRequest(_conf, {'id': id.toString()})
      data = Object.keys(data).length === 0
    }
    else {
      data = this.query().find(id) !== null
    }
    return data
  }
  
  /**
  * Wrap count method
  * @param {MethodConf} conf a method's conf
  * @static
  * @return {Promise<Number>} number of element
  */
  public static async count(conf: MethodConf = this.getMethodConf('count')): Promise<number> {
    const _conf = this.checkMethodConf('count', conf)
    let data
    
    if (_conf.remote) {
      data = await this.httpRequest(_conf)
      data = (data as Array<any>).length
    }
    else {
      data = this.query().count()
    }
    return data
  }
  
  /**
  * Wrap create method
  * @param {Record | Record[]} data to create
  * @param {MethodConf} conf a method's conf
  * @static
  * @return {Promise<EntityCollection>} the created data
  */
  public static async create(
    data: Record | Record[],
    conf: MethodConf = this.getMethodConf('create')
  ): Promise<EntityCollection> {
    
    const _conf = this.checkMethodConf('create', conf)
    let dataOutput
    if (_conf.remote) {
      dataOutput = this.httpRequest(_conf)
      
      if (_conf.localSync) {
        this.dispatch('insert', { data: dataOutput })
      }
    }
    /* tslint:disable */
    else {
      dataOutput = this.dispatch('create', data)
    }
    
    return dataOutput
  }
  
  /**
  * Wrap update method
  * @param {number} id of the record to search
  * @param {Record | Record[] | UpdateClosure} data to update
  * @param {MethodConf} conf a method's conf
  * @static
  * @return {Promise<UpdateReturn>} updated data
  */
  public static async update(
    id: number,
    data: Record | Record[] | UpdateClosure,
    conf: MethodConf = this.getMethodConf('update')
  ): Promise<UpdateReturn> {
    
    const _conf = this.checkMethodConf('update', conf)
    let dataOutput
    if (_conf.remote) {
      dataOutput = this.httpRequest(_conf, {'id': id.toString()})

      if (_conf.localSync && dataOutput) {
        this.dispatch('update', {
          where: id,
          data: dataOutput
        })
      }
    }
    /* tslint:disable */
    else {
      dataOutput = this.dispatch('update', {
        where: id,
        data
      })
    }
    
    return dataOutput
  }
  
  /**
  * Wrap deleteById method
  * @param id of record to delete
  * @param {MethodConf} conf a method's conf
  * @static
  */
  public static async deleteById(
    id: number,
    conf: MethodConf = this.getMethodConf('deleteById')
  ): Promise<void> {
    
    const _conf = this.checkMethodConf('deleteById', conf)
    
    if (_conf.remote) {
      const dataOutput = this.httpRequest(_conf, {'id': id.toString()})
      
      if (_conf.localSync && dataOutput) {
        this.dispatch('delete', id)
      }
    }
    /* tslint:disable */
    else {
      this.dispatch('delete', id)
    }
  }
  
  /**
  * Wrap deleteAll method
  * @param {MethodConf} conf a method's conf
  * @static
  */
  public static async delete(
    conf: MethodConf = this.getMethodConf('deleteById')
  ): Promise<void> {
      
      const _conf = this.checkMethodConf('deleteById', conf)
      
      if (_conf.remote) {
        const dataOutput = this.httpRequest(_conf)
        if (_conf.localSync && dataOutput) {
          this.dispatch('deleteAll', {})
        }
      }
      /* tslint:disable */
      else {
        this.dispatch('deleteAll', {})
      }
    }
    
    /**
    * Wrap query getter
    * @static
    */
    public static query(): Query {
      return this.getters('query')()
    }
    
    /**
    * Build a url of api from the global configuration 
    * of model and optionaly the pass params 
    * @param {MethodConf} conf a method's conf
    * @param {PathParams} pathParams a method's path params
    * @static
    * @return {string} api's url
    */
    protected static getUrl(
      conf: MethodConf,
      pathParams?: PathParams
    ): string {
      const methodPath = pathParams ?
      conf.bindPathParams(pathParams) : (conf.http as any).url
      
      return this._conf.http!.url + methodPath
    }
    
    /**
    * Check if the method configuration exist and 
    * assign the pass method's conf to it
    * Return a new method's configuration
    * @param {string} methodName a method's name
    * @param {ModelConf} conf a method's conf
    * @private
    * @static
    * @return {MethodConf} the new method's configuration
    * @throws Error
    */
    protected static checkMethodConf(
      methodName: string,
      conf: MethodConf
    ): MethodConf {
      const _conf = this._conf as ModelConf
      let _method = _conf.method(methodName)
      if (conf && _method) {
        _method = new MethodConf(_method as MethodConf)
        _method.assign(conf)
      }
      if (!_method) {
        throw new Error(`${methodName} configuration not found`)
      }
      if (!_method.http) {
        throw new Error(`${methodName} http configuration not found`)
      }
      return _method as MethodConf
    }
    
    /**
    * Get the model conf
    * @static
    * @return {ModelConf}
    */
    protected static getConf(): ModelConf {
      return this._conf as ModelConf
    }
    
    /**
    * Get the method conf by name
    * @param {string} methodName The method's name
    * @static
    * @return {MethodConf}
    */
    protected static getMethodConf(methodName: string): MethodConf {
      return this.getConf().method(methodName) as MethodConf
    }
  }
  