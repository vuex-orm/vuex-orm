import BaseModel from './BaseModel'
import Http from '../http/Http'
// import { ModuleOptions } from '../options/Options'
import { Record } from '../data'
import Query, { UpdateClosure, Condition } from '../query/Query'
import EntityCollection from '../query/EntityCollection'
import { Collection, Item } from '../query'
import ModelConf, { JsonModelConf , defaultConf } from '../model/ModelConf'
import { replaceAll } from '../support/Utils'

export type UpdateReturn = Item | Collection | EntityCollection

export default class Model extends BaseModel {
  public static _conf: ModelConf | JsonModelConf

  public static conf () {

    const _conf: JsonModelConf = this._conf as JsonModelConf

    this._conf = new ModelConf(
      JSON.parse(
        replaceAll(
          JSON.stringify(defaultConf),
          '{self}',
          this.name.toLowerCase()
        )
      )
    )

    if (_conf) {
      this._conf.extend(
        JSON.parse(
          replaceAll(
            JSON.stringify(_conf),
            '{self}',
            this.name.toLowerCase()
          )
        )
      )
    }
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
  public static find (): Promise<Collection> {
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
  public static fetch (): Promise<UpdateReturn> {
    const data = this.query().get()
    if (data.length) return Promise.resolve(data)

    return this.refresh()
  }

  /**
   * Fetch data from api and store in vuex
   * @return {Promise<UpdateReturn>} stored data
   */
  public static refresh (): Promise<UpdateReturn> {
    const baseUrl = 'api' // ModuleOptions.resources.baseUrl
    const url = `${baseUrl}/${this.name.toLowerCase()}.json`

    return Http.get(url).then(
      (data: any) => {
        return this.dispatch('insertOrUpdate', { data })
      },
      err => {
        console.log(err)
      }
    )
  }
}
