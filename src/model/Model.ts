import BaseModel from './BaseModel'
import Http from '../http/Http'
// import { ModuleOptions } from '../options/Options'

export default class Model extends BaseModel {
  /**
   * The api path
   */
  public static apiPath: string

  /**
   * Parse data after api response before save on the vuex store
   */
  public static onSuccessFetch (data: any): Promise<any> {
    return Promise.resolve(data)
  }

  /**
   * Wrap query getter
   */
  public static query (): any {
    return this.getters('query')()
  }

  /**
   * Wrap count method
   */
  public static count (): number {
    return this.query().all().length
  }

  /**
   * Fetch data from api server if the store is empty
   */
  public static fetch (): Promise<any> {
    const data = this.query().get()
    if (data.length) return Promise.resolve(data)

    return this.refresh()
  }

  /**
   * Fetch data from api and store in vuex
   */
  public static refresh (): any {
    const baseUrl = 'api' // ModuleOptions.resources.baseUrl
    const url = `${baseUrl}/${this.name.toLowerCase()}.json`

    return Http.get(url).then(
      data => {
        this.dispatch('insertOrUpdate', { data: data })
      },
      err => {
        console.log(err)
      }
    )
  }
}
