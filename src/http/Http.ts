import Axios, {
  AxiosRequestConfig,
  AxiosPromise,
  AxiosResponse,
  AxiosInstance
} from 'axios'

export type InterceptorRequestClosure = 
  (record: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>

export type InterceptorResponseClosure = 
  (record: AxiosResponse) => AxiosResponse<any> | Promise<AxiosResponse<any>>

export interface InterceptosClosures {
  requestInterceptors?: InterceptorRequestClosure[];
  responseInterceptors?: InterceptorResponseClosure[]
}

export type HttpConf = AxiosRequestConfig;

export default class Http {
  private axiosInstance: AxiosInstance
  
  constructor(config: AxiosRequestConfig & InterceptosClosures) {
    this.axiosInstance = Axios.create(config);
    
    if(config.requestInterceptors && Array.isArray(config.requestInterceptors)) {
      config.requestInterceptors.forEach(
        (value: InterceptorRequestClosure) => {
          this.axiosInstance.interceptors.request.use(value)
        }
      )
    }

    if(config.responseInterceptors && Array.isArray(config.responseInterceptors)) {
      config.responseInterceptors.forEach(
        (value: InterceptorResponseClosure) => {
          this.axiosInstance.interceptors.response.use(value)
        }
      )
    }
  }

  public static registerRequestInterceptor(requestInterceptor: InterceptorRequestClosure) {
    Axios.interceptors.request.use(requestInterceptor)
  }

  public static registerResponseInterceptor(responseInterceptor: InterceptorResponseClosure) {
    Axios.interceptors.response.use(responseInterceptor)
  }

  public request<T>(config: AxiosRequestConfig): AxiosPromise<T> {
    return this.axiosInstance.request<T>(config);
  }

  public head (
    url: string, 
    config?: AxiosRequestConfig
  ): AxiosPromise<any> {
    return this.axiosInstance.head(url, config);
  }

  public get <T> (
    url: string, 
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.axiosInstance.get<T>(url, config);
  }

  public post <T> (
    url: string,
    data = {},
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public patch <T> (
    url: string,
    data = {},
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public put <T> (
    url: string,
    data = {},
    config?: AxiosRequestConfig
  ): AxiosPromise<T> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete (
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise<any> {
    return this.axiosInstance.delete(url, config);
  }
}
