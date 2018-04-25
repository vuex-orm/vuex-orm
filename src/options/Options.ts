export interface ResourcesOptions {
  baseUrl?: string
}

export interface Options {
  namespace?: string
  resources?: ResourcesOptions
}

export default class ModuleOptions implements Options {
  public static namespace: string = 'entities'
  public static resources: ResourcesOptions = {
    baseUrl: ''
  }

  public static register (options: Options = {}) {
    if (options.namespace) {
      this.namespace = options.namespace
    }
    if (options.resources) {
      this.resources = options.resources
    }
  }

}
