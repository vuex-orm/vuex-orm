import BaseModel from './BaseModel'
import Http from '../http/Http'
import ModuleOptions from '../options/Options'
import { Record } from '../data'
import Query, { UpdateClosure, Condition } from '../query/Query'
import EntityCollection from '../query/EntityCollection'
import { Collection, Item } from '../query'
import ModelConf, { JsonModelConf , defaultConf, MethodConf, HttpMethod, PathParam } from '../model/ModelConf'
import { replaceAll } from '../support/Utils'

export type UpdateReturn = Item | Collection | EntityCollection

export default class Model extends BaseModel {
  public static _conf: ModelConf | JsonModelConf

  /**
   * Configure a model with default conf and extend or override
   * the default configuration with a custom configuration present on
   * model class or on parameter.
   * Priority confs:
   * default -> custom on model class -> custom on conf() parameter
   * @param {parameterConf} parameterConf optionaly a json model's conf
   * @static
   */
  public static conf (parameterConf?: JsonModelConf): void {

    const _onModelconf: JsonModelConf = this._conf as JsonModelConf

    // instance default conf
    this._conf = new ModelConf(
      JSON.parse(
        replaceAll(
          JSON.stringify(defaultConf),
          '{self}',
          this.entity
        )
      )
    )

    // check if confs on model are present
    if (_onModelconf) {
      this._conf.extend(
        JSON.parse(
          replaceAll(
            JSON.stringify(_onModelconf),
            '{self}',
            this.entity
          )
        )
      )
    }

    // check if confs parameter are present
    if (parameterConf) {
      this._conf.extend(
        JSON.parse(
          replaceAll(
            JSON.stringify(parameterConf),
            '{self}',
            this.entity
          )
        )
      )
    }
  }

  /**
   * Get the model conf
   * @static
   * @return {ModelConf}
   */
  public static getConf (): ModelConf {
    return this._conf as ModelConf
  }

  /**
   * Get the method conf by name
   * @param {string} methodName The method's name
   * @static
   * @return {MethodConf}
   */
  public static getMethodConf (methodName: string): MethodConf {
    return this.getConf().method(methodName) as MethodConf
  }

  /**
   * Wrap query getter
   * @static
   */
  public static query (): Query {
    return this.getters('query')()
  }

  /**
   * Wrap find method
   * @static
   * @async
   * @return {Promise<Collection>} list of results
   */
  public static async find (conf: MethodConf = this.getMethodConf('find')): Promise<Collection> {
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
   * @static
   * @return {Promise<Item>} result object
   */
  public static async findById (id: number, conf: MethodConf = this.getMethodConf('findById')): Promise<Item> {
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
   * Check if record identified by id param exist
   * @param {number} id of the record to search
   * @static
   * @return {Promise<boolean>} the result
   */
  public static exist (id: number): Promise<boolean> {
    return this.findById(id).then(
      (item: Item) => {
        return item !== null
      }
    )
  }

  /**
   * Wrap count method
   * @static
   * @return {Promise<Number>} number of element
   */
  public static count (): Promise<number> {
    return Promise.resolve(this.query().count())
  }

  /**
   * Wrap deleteById method
   * @param id of record to delete
   * @static
   */
  public static deleteById (id: number): void {
    this.dispatch('delete', id)
  }

  /**
   * Wrap deleteAll method
   * @static
   */
  public static deleteAll (): void {
    this.dispatch('deleteAll', {})
  }

  /**
   * Wrap create method
   * @param {Record | Record[]} data to create
   * @static
   * @return {Promise<EntityCollection>} the created data
   */
  public static create (data: Record | Record[]): Promise<EntityCollection> {
    return this.dispatch('create', { data })
  }

  /**
   * Wrap update method
   * @param {Record | Record[] | UpdateClosure} data to update
   * @param {Condition} where conditions
   * @static
   * @return {Promise<UpdateReturn>} updated data
   */
  public static update (data: Record | Record[] | UpdateClosure, where?: Condition): Promise<UpdateReturn> {
    return this.dispatch('update', {
      where,
      data
    })
  }

  /**
   * Wrap insertOrUpdate method
   * @param {Record | Record[]} data to unsert or update
   * @static
   * @return {Promise<UpdateReturn>} data result
   */
  public static insertOrUpdate (data: Record | Record[]): Promise<UpdateReturn> {
    return this.dispatch('insertOrUpdate', data)
  }

  /**
   * Fetch data from api server and sync to the local store (optionaly)
   * @param {MethodConf} conf a method's conf
   * @static
   * @async
   * @return {Promise<UpdateReturn>} fetched data
   */
  public static async fetch (conf: MethodConf = this.getMethodConf('fetch')): Promise<Collection> {
    const _conf = this.checkMethodConf('fetch', conf)
    const url = this.getUrl(_conf)
    const data = await Http[_conf.http.method as HttpMethod](url)
      .catch((err: Error) => { console.log(err); }) || []

    if(_conf.localSync) {
      await this.dispatch('insertOrUpdate', { data })
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
  public static async fetchById(id: number, conf: MethodConf = this.getMethodConf('fetchById')): Promise<Item> {
    const _conf = this.checkMethodConf('fetchById', conf)
    const url = this.getUrl(_conf, new PathParam('id', id.toString()))
    const data = await Http[_conf.http.method as HttpMethod](url)
      .catch((err: Error) => { console.log(err); }) || []
    
    if(_conf.localSync) {
      // await this.dispatch('insertOrUpdate', { data })
      await this.update(data)
    }
    return data
  }

  /**
   * Build a url of api from the global configuration 
   * of model and optionaly the pass params 
   * @param {MethodConf} conf a method's conf
   * @param {PathParam[]} pathParams a method's path params
   * @static
   * @return {string} api's url
   */
  public static getUrl(conf: MethodConf, ...pathParams: PathParam[]): string {
    let baseUrl = this._conf.baseUrl
    const methodPath = pathParams.length ? conf.http.bindPathParams(pathParams) : conf.http.path
    if(ModuleOptions.resources.baseUrl) {
      baseUrl = ModuleOptions.resources.baseUrl
    }
    return baseUrl + this._conf.endpointPath + methodPath
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
  private static checkMethodConf(methodName: string, conf: MethodConf): MethodConf {
    const _conf = this._conf as ModelConf
    let _method = _conf.method(methodName)
    if (conf && _method) {
      _method = new MethodConf(_method as MethodConf)
      _method.assign(conf)
    }
    if(!_method) {
      throw new Error(`${methodName} configuration method not found`)
    }
    return _method as MethodConf
  }
}
