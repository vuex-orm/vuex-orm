import { HttpConf, InterceptorRequestClosure, InterceptorResponseClosure } from '../http/Http';
interface InterceptosClosures {
    requestInterceptor?: InterceptorRequestClosure;
    responseInterceptor?: InterceptorResponseClosure;
}
export interface Options {
    namespace?: string;
    http?: HttpConf & InterceptosClosures;
}
export default class ModuleOptions implements Options {
    static namespace: string;
    static http: HttpConf & InterceptosClosures;
    static register(options?: Options): void;
    private static confAxiosModule;
    static check(): void;
    static checkBaseUrl(): void;
    static checkTimeout(): void;
    static checkHeader(): void;
}
export {};
