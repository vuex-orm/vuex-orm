import { HttpConf } from '../http/Http';
export interface JsonModelConf {
    http?: HttpConf;
    methods?: MethodConf[];
}
export declare enum HttpMethod {
    GET = "get",
    HEAD = "head",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete"
}
export interface PathParams {
    [key: string]: any;
}
export default class ModelConf {
    /**
     * The http config
     */
    http: HttpConf | undefined;
    /**
     * The methods of model
     */
    methods: Map<string, MethodConf>;
    /**
     * Create a model's configuration from json
     * @param {JsonModelConf} jsonConfig the json model's configuration
     */
    constructor(conf?: JsonModelConf);
    /**
     * Extend a current model's conf with the conf pass
     * @param {JsonModelConf} conf a json model's conf
     */
    extend(conf: JsonModelConf): void;
    /**
     * Get a method by name or alias
     * @param {string} name the method's name to find
     * @return {MethodConf | undefined} return the method fint
     */
    method(name: string): MethodConf | undefined;
    /**
     * Add a model method
     * @param name the method name
     * @param method the method conf
     */
    addMethodConf(name: string, method: MethodConf): void;
}
export declare class MethodConf {
    /**
     * The method's name
     */
    name: string;
    /**
     * The method's name
     */
    alias?: string[];
    /**
     * The boolean for indicate a api comunication
     */
    remote?: boolean;
    /**
     * The boolean for indicate a local sync
     */
    localSync?: boolean;
    /**
     * The method's http configuration
     */
    http?: HttpConf;
    /**
     * Constructor
     * @constructor
     * @param {MethodConf}
     */
    constructor({ name, alias, remote, localSync, http }: MethodConf);
    /**
     * Assign the new conf for the method
     * @param {MethodConf}
     */
    assign({ name, alias, remote, localSync, http }: MethodConf): void;
    /**
     * Bind a path param name with the pass value
     * @param {PathParams} params object key => val
     * @return {string} path with bind params
     */
    bindPathParams(params: PathParams): string;
}
export declare const defaultConf: {
    "http": {
        "baseURL": string;
        "url": string;
    };
    "methods": ({
        "name": string;
        "alias": string[];
        "remote": boolean;
        "localSync": boolean;
        "http": {
            "url": string;
            "method": string;
        };
    } | {
        "name": string;
        "remote": boolean;
        "http": {
            "url": string;
            "method": string;
        };
        "alias"?: undefined;
        "localSync"?: undefined;
    } | {
        "name": string;
        "remote": boolean;
        "localSync": boolean;
        "http": {
            "url": string;
            "method": string;
        };
        "alias"?: undefined;
    })[];
};
