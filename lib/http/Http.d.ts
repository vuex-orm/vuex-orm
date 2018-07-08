import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
export declare type InterceptorRequestClosure = (record: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
export declare type InterceptorResponseClosure = (record: AxiosResponse) => AxiosResponse<any> | Promise<AxiosResponse<any>>;
export declare type HttpConf = AxiosRequestConfig;
export default class Http {
    static defaultConf: AxiosRequestConfig;
    static conf(config: AxiosRequestConfig): void;
    static registerRequestInterceptor(requestInterceptor: InterceptorRequestClosure): void;
    static registerResponseInterceptor(responseInterceptor: InterceptorResponseClosure): void;
    private static mergeConf;
    static head(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;
    static get<T>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
    static post<T>(url: string, data?: {}, config?: AxiosRequestConfig): AxiosPromise<T>;
    static patch<T>(url: string, data?: {}, config?: AxiosRequestConfig): AxiosPromise<T>;
    static put<T>(url: string, data?: {}, config?: AxiosRequestConfig): AxiosPromise<T>;
    static delete(url: string, config?: AxiosRequestConfig): AxiosPromise<any>;
}
