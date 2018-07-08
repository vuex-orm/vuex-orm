import BaseModel from './BaseModel';
import { HttpConf } from '../http/Http';
import { Record } from '../data';
import Query, { UpdateClosure } from '../query/Query';
import EntityCollection from '../query/EntityCollection';
import { Collection, Item } from '../query';
import ModelConf, { JsonModelConf, MethodConf, PathParam } from '../model/ModelConf';
export declare type UpdateReturn = Item | Collection | EntityCollection;
export declare type MethodConfParameter = MethodConf & HttpConf;
export default class Model extends BaseModel {
    static _conf: ModelConf | (JsonModelConf & HttpConf);
    /**
     * Configure a model with default conf and extend or override
     * the default configuration with a custom configuration present on
     * model class or on parameter.
     * Priority confs:
     * default -> custom on model class -> custom on conf() parameter
     * @param {parameterConf} parameterConf optionaly a json model's conf
     * @static
     */
    static conf(parameterConf?: JsonModelConf): void;
    /**
     * Fetch data from api server and sync to the local store (optionaly)
     * @param {MethodConf} conf a method's conf
     * @static
     * @async
     * @return {Promise<UpdateReturn>} fetched data
     */
    static fetch(conf?: MethodConfParameter): Promise<Collection>;
    /**
     * Wrap find method
     * @param {MethodConf} conf a method's conf
     * @static
     * @async
     * @return {Promise<Collection>} list of results
     */
    static find(conf?: MethodConfParameter): Promise<Collection>;
    /**
     * Wrap findById method
     * @param {number} id of record to find
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<Item>} result object
     */
    static findById(id: number, conf?: MethodConfParameter): Promise<Item>;
    /**
     * Exec a fetchById api method with the default confs
     * or the pass confs and sync to the local store (optionaly)
     * @param {number} id of the fetching record
     * @param {MethodConf} conf a method's conf
     * @static
     * @async
     * @return {Promise<Item>} fetched item
     */
    static fetchById(id: number, conf?: MethodConfParameter): Promise<Item>;
    /**
     * Check if record identified by id param exist
     * @param {number} id of the record to search
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<boolean>} the result
     */
    static exist(id: number, conf?: MethodConfParameter): Promise<boolean>;
    /**
     * Wrap count method
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<Number>} number of element
     */
    static count(conf?: MethodConfParameter): Promise<number>;
    /**
     * Wrap create method
     * @param {Record | Record[]} data to create
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<EntityCollection>} the created data
     */
    static create(data: Record | Record[], conf?: MethodConfParameter): Promise<EntityCollection>;
    /**
     * Wrap update method
     * @param {number} id of the record to search
     * @param {Record | Record[] | UpdateClosure} data to update
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<UpdateReturn>} updated data
     */
    static update(id: number, data: Record | Record[] | UpdateClosure, conf?: MethodConfParameter): Promise<UpdateReturn>;
    /**
     * Wrap deleteById method
     * @param id of record to delete
     * @param {MethodConf} conf a method's conf
     * @static
     */
    static deleteById(id: number, conf?: MethodConfParameter): Promise<void>;
    /**
     * Wrap deleteAll method
     * @param {MethodConf} conf a method's conf
     * @static
     */
    static delete(conf?: MethodConfParameter): Promise<void>;
    /**
     * Wrap query getter
     * @static
     */
    static query(): Query;
    /**
     * Build a url of api from the global configuration
     * of model and optionaly the pass params
     * @param {MethodConf} conf a method's conf
     * @param {PathParam[]} pathParams a method's path params
     * @static
     * @return {string} api's url
     */
    protected static getUrl(conf: MethodConfParameter, ...pathParams: PathParam[]): string;
    /**
     * Check if the method configuration exist and
     * assign the pass method's conf to it
     * Return a new method's configuration
     * @param {string} methodName a method's name
     * @param {ModelConf} conf a method's conf
     * @private
     * @static
     * @return {MethodConf} the new method's configuration
     * @throws Error
     */
    protected static checkMethodConf(methodName: string, conf: MethodConfParameter): MethodConf;
    /**
     * Get the model conf
     * @static
     * @return {ModelConf}
     */
    protected static getConf(): ModelConf;
    /**
     * Get the method conf by name
     * @param {string} methodName The method's name
     * @static
     * @return {MethodConf}
     */
    protected static getMethodConf(methodName: string): MethodConfParameter;
}
