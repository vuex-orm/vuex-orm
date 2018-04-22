import BaseModel from './BaseModel'
import Http from '../http/Http'
// import { ModuleOptions } from '../options/Options'
import { Record } from '../data'
import Query, { UpdateClosure, Condition } from '../query/Query'
import EntityCollection from '../query/EntityCollection'
import { Collection, Item } from '../query'
import ModelConf, { JsonModelConf , defaultConf, MethodConf, HttpMethod } from '../model/ModelConf'
import { replaceAll } from '../support/Utils'

export type UpdateReturn = Item | Collection | EntityCollection

export default class Model extends BaseModel {
  public static _conf: ModelConf | JsonModelConf

  /**
   * Configure a model with default conf and extend or override
   * the default configuration with a custom configuration
   */
  public static conf (): void {

    const _conf: JsonModelConf = this._conf as JsonModelConf

    this._conf = new ModelConf(
      JSON.parse(
        replaceAll(
          JSON.stringify(defaultConf),
          '{self}',
          this.entity
        )
      )
    )

    if (_conf) {
      this._conf.extend(
        JSON.parse(
          replaceAll(
            JSON.stringify(_conf),
            '{self}',
            this.entity
          )
        )
      )
    }
  }

  /**
   * Get the model conf
   * @return {ModelConf}
   */
  public static getConf (): ModelConf {
    return this._conf as ModelConf
  }

  /**
   * Get the method conf by name
   * @param {string} methodName The method's name
   * @return {MethodConf}
   */
  public static getMethodConf (methodName: string): MethodConf {
    return this.getConf().method(methodName) as MethodConf
  }

  /**
   * Wrap query getter
   */
  public static query (): Query {
    return this.getters('query')()
  }

  /**
   * Wrap find method
   * @return {Promise<Collection>} list of results
   */
  public static find (conf: MethodConf = this.getMethodConf('find')): Promise<Collection> {
    const _conf = this.checkMethodConf('find', conf)

    if (_conf.refreshFromApi) {
      return this.fetch(conf)
    }

    return Promise.resolve(this.query().all())
  }

  /**
   * Wrap findById method
   * @param {number} id of record to find
   * @return {Promise<Item>} result object
   */
  public static findById (id: number): Promise<Item> {
    return Promise.resolve(this.query().find(id))
  }

  /**
   * Check if record identified by id param exist
   * @param {number} id of the record to search
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
   * @return {Promise<Number>} number of element
   */
  public static count (): Promise<number> {
    return Promise.resolve(this.query().count())
  }

  /**
   * Wrap deleteById method
   * @param id of record to delete
   */
  public static deleteById (id: number): void {
    this.dispatch('delete', id)
  }

  /**
   * Wrap deleteAll method
   */
  public static deleteAll (): void {
    this.dispatch('deleteAll', {})
  }

  /**
   * Wrap create method
   * @param {Record | Record[]} data to create
   * @return {Promise<EntityCollection>} the created data
   */
  public static create (data: Record | Record[]): Promise<EntityCollection> {
    return this.dispatch('create', { data })
  }

  /**
   * Wrap update method
   * @param {Record | Record[] | UpdateClosure} data to update
   * @param {Condition} where conditions
   * @return {Promise<UpdateReturn>} updated data
   */
  public static update (data: Record | Record[] | UpdateClosure, where: Condition): Promise<UpdateReturn> {
    return this.dispatch('update', {
      where,
      data
    })
  }

  /**
   * Wrap insertOrUpdate method
   * @param {Record | Record[]} data to unsert or update
   * @return {Promise<UpdateReturn>} data result
   */
  public static insertOrUpdate (data: Record | Record[]): Promise<UpdateReturn> {
    return this.dispatch('insertOrUpdate', data)
  }

  /**
   * Fetch data from api server if the store is empty
   * @return {Promise<UpdateReturn>} fetched data
   */
  public static async fetch (conf: MethodConf = this.getMethodConf('fetch')): Promise<Collection> {
    let data
    const _conf = this.checkMethodConf('fetch', conf)

    if (_conf.refreshFromApi) {
      data = await this.refresh(conf)
    }
    /* tslint:disable */
    else {
      data = this.query().get()
      // if (!data.length) {
      //   data = await this.refresh(conf)
      // }
    }
    return data
  }

  /**
   * Fetch data from api and store in vuex
   * @return {Promise<Collection>} stored data
   */
  public static async refresh (conf: MethodConf = this.getMethodConf('fetch')): Promise<Collection> {
    const _conf = this.checkMethodConf('refresh', conf)
    const url = this._conf.baseUrl + this._conf.endpointPath + _conf.http.path
    const data = await Http[_conf.http.method as HttpMethod](url)
    await this.dispatch('insertOrUpdate', { data })
    return data
  }

  /**
   * Check the method configuration
   * Return a new method's configuration
   * @param {string} methodName 
   * @param {ModelConf} conf
   * @return {MethodConf}
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
