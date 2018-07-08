import Axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios'

export type InterceptorRequestClosure = 
  (record: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>

export type InterceptorResponseClosure = 
  (record: AxiosResponse) => AxiosResponse<any> | Promise<AxiosResponse<any>>

export type HttpConf = AxiosRequestConfig;

export default class Http {

  public static defaultConf: AxiosRequestConfig

  public static conf(config: AxiosRequestConfig) {
    this.defaultConf = config
  }

  public static registerRequestInterceptor(requestInterceptor: InterceptorRequestClosure) {
    Axios.interceptors.request.use(requestInterceptor)
  }

  public static registerResponseInterceptor(responseInterceptor: InterceptorResponseClosure) {
    Axios.interceptors.response.use(responseInterceptor)
  }

  private static mergeConf(config: AxiosRequestConfig) {
    return { ...this.defaultConf, ...config }
  }

  public static head (
    url: string, 
    config: AxiosRequestConfig = this.defaultConf
  ): AxiosPromise<any> {
    this.mergeConf(config)
    return Axios.head(url, config);
  }

  public static get <T> (
    url: string, 
    config: AxiosRequestConfig = this.defaultConf
  ): AxiosPromise<T> {
    this.mergeConf(config)
    return Axios.get<T>(url, config);
  }

  public static post <T> (
    url: string, 
    data = {}, 
    config: AxiosRequestConfig = this.defaultConf
  ): AxiosPromise<T> {
    this.mergeConf(config)
    return Axios.post<T>(url, data, config);
  }

  public static patch <T> (
    url: string, 
    data = {}, 
    config: AxiosRequestConfig = this.defaultConf
  ): AxiosPromise<T> {
    this.mergeConf(config)
    return Axios.patch<T>(url, data, config);
  }

  public static put <T> (
    url: string, 
    data = {}, 
    config: AxiosRequestConfig = this.defaultConf
  ): AxiosPromise<T> {
    this.mergeConf(config)
    return Axios.put<T>(url, data, config);
  }

  public static delete (
    url: string, 
    config: AxiosRequestConfig = this.defaultConf
  ): AxiosPromise<any> {
    this.mergeConf(config)
    return Axios.delete(url, config);
  }
}
