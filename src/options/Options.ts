import {
  HttpConf,
  InterceptosClosures
} from '../http/Http';

export interface Options {
  namespace?: string
  http?: HttpConf & InterceptosClosures
}

export default class ModuleOptions implements Options {
  public static namespace: string = 'entities'
  public static defaultHttpConfig: HttpConf & InterceptosClosures

  public static register (options: Options = {}): void {
    if (options.namespace) {
      this.namespace = options.namespace
    }
    if (options.http) {
      this.defaultHttpConfig = options.http
    }
    this.check()
  }
  public static check(): void {
    if(!this.defaultHttpConfig) {
      throw new Error('Vuex orm resources: missing default http conf');
    }
    this.checkBaseUrl()
    this.checkHeader()
    this.checkTimeout()
  }
  public static checkBaseUrl(): void {
    if(!this.defaultHttpConfig.baseURL) {
      throw new Error('Vuex orm resources: missing default http baseURL conf');
    }
  }
  public static checkTimeout(): void {
    if(!this.defaultHttpConfig.timeout) {
      throw new Error('Vuex orm resources: missing default http timeout conf');
    }
  }
  public static checkHeader(): void {
    if(!this.defaultHttpConfig.headers) {
      throw new Error('Vuex orm resources: missing default http headers conf');
    }

    if(!this.defaultHttpConfig.headers['Content-Type']) {
      throw new Error('Vuex orm resources: missing default http Content-Type headers conf');
    }
  }
  public static getDefaultHttpConfig(): HttpConf & InterceptosClosures {
    return this.defaultHttpConfig
  }
}
