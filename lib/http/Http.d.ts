import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
export declare type InterceptorRequestClosure = (record: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
export declare type InterceptorResponseClosure = (record: AxiosResponse) => AxiosResponse<any> | Promise<AxiosResponse<any>>;
export interface InterceptosClosures {
    requestInterceptors?: InterceptorRequestClosure[];
    responseInterceptors?: InterceptorResponseClosure[];
}
export declare type HttpConf = AxiosRequestConfig;
export default class Http {
    private axiosInstance;
    constructor(config: AxiosRequestConfig & InterceptosClosures, defaultConfig: AxiosRequestConfig & InterceptosClosures);
    static registerRequestInterceptor(requestInterceptor: InterceptorRequestClosure): void;
    static registerResponseInterceptor(responseInterceptor: InterceptorResponseClosure): void;
    private mergeConf;
    head(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;
    get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    post<T>(url: string, data?: {}, config?: AxiosRequestConfig): AxiosPromise<T>;
    patch<T>(url: string, data?: {}, config?: AxiosRequestConfig): AxiosPromise<T>;
    put<T>(url: string, data?: {}, config?: AxiosRequestConfig): AxiosPromise<T>;
    delete(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;
}
