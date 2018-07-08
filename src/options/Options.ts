import Http, {
  HttpConf,
  InterceptorRequestClosure,
  InterceptorResponseClosure
} from '../http/Http';

interface InterceptosClosures {
  requestInterceptor?: InterceptorRequestClosure;
  responseInterceptor?: InterceptorResponseClosure
}

export interface Options {
  namespace?: string
  http?: HttpConf & InterceptosClosures
}

export default class ModuleOptions implements Options {
  public static namespace: string = 'entities'
  public static http: HttpConf & InterceptosClosures

  public static register (options: Options = {}) {
    if (options.namespace) {
      this.namespace = options.namespace
    }
    if (options.http) {
      this.http = options.http
    }
    this.check()
    this.confAxiosModule()
  }

  private static confAxiosModule() {
    
    Http.conf(this.http)

    if(this.http.requestInterceptor) {
      Http.registerRequestInterceptor(this.http.requestInterceptor)
    }
    
    if(this.http.responseInterceptor) {
      Http.registerResponseInterceptor(this.http.responseInterceptor)
    }
    
  }
  public static check() {
    if(!this.http) {
      throw new Error('Vuex orm resources: missing default http conf');
    }
    this.checkBaseUrl()
    this.checkHeader()
    this.checkTimeout()
  }
  public static checkBaseUrl() {
    if(!this.http.baseURL) {
      throw new Error('Vuex orm resources: missing default http baseURL conf');
    }
  }
  public static checkTimeout() {
    if(!this.http.timeout) {
      throw new Error('Vuex orm resources: missing default http timeout conf');
    }
  }
  public static checkHeader() {
    if(!this.http.headers) {
      throw new Error('Vuex orm resources: missing default http headers conf');
    }

    if(!this.http.headers['Content-Type']) {
      throw new Error('Vuex orm resources: missing default http Content-Type headers conf');
    }
  }

}
