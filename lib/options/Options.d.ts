import { HttpConf, InterceptosClosures } from '../http/Http';
export interface Options {
    namespace?: string;
    http?: HttpConf & InterceptosClosures;
}
export default class ModuleOptions implements Options {
    static namespace: string;
    static defaultHttpConfig: HttpConf & InterceptosClosures;
    static register(options?: Options): void;
    static check(): void;
    static checkBaseUrl(): void;
    static checkTimeout(): void;
    static checkHeader(): void;
    static getDefaultHttpConfig(): HttpConf & InterceptosClosures;
}
