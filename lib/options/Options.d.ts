export interface ResourcesOptions {
    baseUrl?: string;
}
export interface Options {
    namespace?: string;
    resources?: ResourcesOptions;
}
export default class ModuleOptions implements Options {
    static namespace: string;
    static resources: ResourcesOptions;
    static register(options?: Options): void;
}
