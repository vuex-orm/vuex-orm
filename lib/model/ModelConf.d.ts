export interface JsonModelConf {
    baseUrl?: string;
    endpointPath: string;
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
export declare class PathParam {
    name: string;
    value: string;
    constructor(name: string, value: string);
}
export default class ModelConf {
    /**
     * The host/domain of api server
     */
    baseUrl: string | undefined;
    /**
     * The endpoint of model entity
     */
    endpointPath: string;
    /**
     * The methods of model
     */
    private _methods;
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
    http: HttpConf;
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
}
export declare class HttpConf {
    /**
     * The http path
     */
    path: string;
    /**
     * The http method
     */
    method: HttpMethod;
    /**
     * @constructor
     * @param {HttpConf}
     */
    constructor({ path, method }: HttpConf);
    /**
     * Bind a path param name with the pass value
     * @param {PathParam[]} params array
     * @return {string} path with bind params
     */
    bindPathParams(params: PathParam[]): string;
}
export declare const defaultConf: {
    "baseUrl": string;
    "endpointPath": string;
    "methods": ({
        "name": string;
        "alias": string[];
        "remote": boolean;
        "localSync": boolean;
        "http": {
            "path": string;
            "method": string;
        };
    } | {
        "name": string;
        "remote": boolean;
        "http": {
            "path": string;
            "method": string;
        };
        "alias"?: undefined;
        "localSync"?: undefined;
    } | {
        "name": string;
        "remote": boolean;
        "localSync": boolean;
        "http": {
            "path": string;
            "method": string;
        };
        "alias"?: undefined;
    })[];
};
