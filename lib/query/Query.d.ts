import * as Vuex from 'vuex';
import { Record, Records, NormalizedData } from '../data';
import { Fields } from '../attributes/contracts/Contract';
import BaseModel from '../model/BaseModel';
import State from '../modules/State';
import EntityState from '../modules/EntityState';
import Hook from './Hook';
import Item from './Item';
import Collection from './Collection';
import EntityCollection from './EntityCollection';
export declare type WhereBoolean = 'and' | 'or';
export declare type WherePrimaryClosure = (record: Record, query: Query, model?: BaseModel) => boolean | void;
export declare type WhereSecondaryClosure = (value: any) => boolean;
export declare type OrderDirection = 'asc' | 'desc';
export declare type UpdateClosure = (record: Record) => void;
export declare type Predicate = (item: Record) => boolean;
export declare type Condition = number | string | Predicate;
export declare type Buildable = Record | Record[] | null;
export declare type Constraint = (query: Query) => void | boolean;
export declare type ConstraintCallback = (relationName: string) => Constraint | null;
export interface PersistOptions {
    create?: string[];
    insert?: string[];
    update?: string[];
    insertOrUpdate?: string[];
}
export interface Wheres {
    field: string | number | WherePrimaryClosure;
    value: string | number | WhereSecondaryClosure;
    boolean: WhereBoolean;
}
export interface Orders {
    field: string;
    direction: OrderDirection;
}
export interface Relation {
    name: string;
    constraint: null | Constraint;
}
export default class Query {
    /**
     * The root state of the Vuex Store.
     */
    rootState: State;
    /**
     * The entity state of the Vuex Store.
     */
    state: EntityState;
    /**
     * The entity name being queried.
     */
    entity: string;
    /**
     * The model being queried.
     */
    model: typeof BaseModel;
    /**
     * The module being queried.
     */
    module: Vuex.Module<any, any>;
    /**
     * The where constraints for the query.
     */
    wheres: Wheres[];
    /**
     * The orders of the query result.
     */
    orders: Orders[];
    /**
     * Number of results to skip.
     */
    _offset: number;
    /**
     * Maximum number of records to return.
     *
     * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
     */
    _limit: number;
    /**
     * The relationships that should be loaded with the result.
     */
    load: Relation[];
    /**
     * The lifecycle hook instance.
     */
    hook: Hook;
    /**
     * Whether to wrap returing record with class or to return as plain object.
     */
    wrap: boolean;
    /**
     * The Vuex Action context.
     */
    actionContext: Vuex.ActionContext<State, any> | null;
    /**
     * Create a new Query instance.
     */
    constructor(state: State, entity: string, wrap?: boolean);
    /**
     * Create a new query instance
     */
    static query(state: State, name: string, wrap?: boolean): Query;
    /**
     * Get model of given name from the container.
     */
    static getModel(state: State, name: string): typeof BaseModel;
    /**
     * Get all models from the container.
     */
    static getModels(state: State): {
        [name: string]: typeof BaseModel;
    };
    /**
     * Get module of given name from the container.
     */
    static getModule(state: State, name: string): Vuex.Module<any, any>;
    /**
     * Get all modules from the container.
     */
    static getModules(state: State): {
        [name: string]: Vuex.Module<any, any>;
    };
    /**
     * Save new data to the state. It will remove all existing data in the
     * state. If you want to keep existing data while saving new data,
     * use `insert` instead.
     */
    static create(state: State, entity: string, data: Record | Record[], options: PersistOptions): EntityCollection;
    /**
     * Commit `create` to the state.
     */
    static commitCreate(state: State, entity: string, records: Records): void;
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    static insert(state: State, entity: string, data: Record | Record[], options: PersistOptions): EntityCollection;
    /**
     * Commit `insert` to the state.
     */
    static commitInsert(state: State, entity: string, data: Records): void;
    /**
     * Update data in the state.
     */
    static update(state: State, entity: string, data: Record | Record[] | UpdateClosure, condition?: Condition, options?: PersistOptions): Item | Collection;
    /**
     * Commit `update` to the state.
     */
    static commitUpdate(state: State, entity: string, data: Records): void;
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    static insertOrUpdate(state: State, entity: string, data: Record | Record[], options: PersistOptions): Item | Collection;
    /**
     * Get all data of the given entity from the state.
     */
    static all(state: State, entity: string, wrap?: boolean): Collection;
    /**
     * Get the record of the given id.
     */
    static find(state: State, entity: string, id: string | number, wrap?: boolean): Item;
    /**
     * Get the count of the retrieved data.
     */
    static count(state: State, entity: string, wrap?: boolean): number;
    /**
     * Get the max value of the specified filed.
     */
    static max(state: State, entity: string, field: string, wrap?: boolean): number;
    /**
     * Get the min value of the specified filed.
     */
    static min(state: State, entity: string, field: string, wrap?: boolean): number;
    /**
     * Delete a record from the state.
     */
    static delete(state: State, entity: string, condition: Condition): Item | Collection;
    /**
     * Delete all records from the state.
     */
    static deleteAll(state: State, entity?: string): Collection | void;
    /**
     * Commit `delete` to the state.
     */
    static commitDelete(state: State, entity: string, ids: string[]): void;
    /**
     * Register a callback. It Returns unique ID for registered callback.
     */
    static on(on: string, callback: Function, once?: boolean): number;
    /**
     * Remove hook registration.
     */
    static off(uid: number): boolean;
    /**
     * Get query class.
     */
    self(): typeof Query;
    /**
     * Create a new query instance.
     */
    newQuery(entity: string): Query;
    /**
     * Create a new query instance with wrap property set to false.
     */
    newPlainQuery(entity: string): Query;
    /**
     * Get model of given name from the container.
     */
    getModel(name?: string): typeof BaseModel;
    /**
     * Get all models from the container.
     */
    getModels(): {
        [name: string]: typeof BaseModel;
    };
    /**
     * Get module of given name from the container.
     */
    getModule(name?: string): Vuex.Module<any, any>;
    /**
     * Get all modules from the container.
     */
    getModules(): {
        [name: string]: Vuex.Module<any, any>;
    };
    /**
     * Commit changes to the state. This method will call mutation name of
     * `method` with `payload` if the method is called from an action to
     * avoid mutating state change outside of mutation handler.
     */
    commit(method: string, payload: any, callback: Function): void;
    /**
     * Set wrap flag to false.
     */
    plain(): Query;
    /**
     * Set Vuex Action Context to the query.
     */
    setActionContext(context: Vuex.ActionContext<State, any> | null): Query;
    /**
     * Save new data to the state. It will remove all existing data in the
     * state. If you want to keep existing data while saving new data,
     * use `insert` instead.
     */
    create(data: Record | Record[], options: PersistOptions): EntityCollection;
    /**
     * Create records to the state.
     */
    createMany(records: Records): Collection;
    /**
     * Commit `create` to the state.
     */
    commitCreate(data: Records): void;
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    insert(data: Record | Record[], options: PersistOptions): EntityCollection;
    /**
     * Insert list of records in the state.
     */
    insertMany(records: Records): Collection;
    /**
     * Commit `insert` to the state.
     */
    commitInsert(data: Records): void;
    /**
     * Update data in the state.
     */
    update(data: Record | Record[] | UpdateClosure, condition?: Condition, options?: PersistOptions): Item | Collection | EntityCollection;
    /**
     * Update all records.
     */
    updateMany(records: Records): Collection;
    /**
     * Update the state by id.
     */
    updateById(data: Record | UpdateClosure, id: string | number): Item;
    /**
     * Update the state by condition.
     */
    updateByCondition(data: Record | UpdateClosure, condition: Predicate): Collection;
    /**
     * Commit `update` to the state.
     */
    commitUpdate(data: Records): void;
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    insertOrUpdate(data: Record | Record[], options: PersistOptions): EntityCollection;
    /**
     * Insert or update the records.
     */
    insertOrUpdateMany(records: Records): Collection;
    /**
     * Persist data into the state.
     */
    persist(data: Record | Record[], method: string, options?: PersistOptions): EntityCollection;
    /**
     * Get method for the persist.
     */
    getPersistMethod(entity: string, method: string, options: PersistOptions): string;
    /**
     * Normalize the given data.
     */
    normalize(data: any): NormalizedData;
    /**
     * Update the state value by merging the given record and state.
     */
    merge(data: Record, state: Record, fields?: Fields): void;
    /**
     * Returns all record of the query chain result. This method is alias
     * of the `get` method.
     */
    all(): Collection;
    /**
     * Get the record of the given id.
     */
    find(id: number | string): Item;
    /**
     * Returns all record of the query chain result.
     */
    get(): Collection;
    /**
     * Returns the first record of the query chain result.
     */
    first(): Item;
    /**
     * Returns the last single record of the query chain result.
     */
    last(): Item;
    /**
     * Get all the records from the state and convert them into the array.
     * If you pass records, it will create an array out of that records
     * instead of the store state.
     */
    records(records?: Records): Record[];
    /**
     * Add a and where clause to the query.
     */
    where(field: any, value?: any): this;
    /**
     * Add a or where clause to the query.
     */
    orWhere(field: any, value?: any): this;
    /**
     * Add an order to the query.
     */
    orderBy(field: string, direction?: OrderDirection): this;
    /**
     * Add an offset to the query.
     */
    offset(offset: number): this;
    /**
     * Add limit to the query.
     */
    limit(limit: number): this;
    /**
     * Set the relationships that should be loaded.
     */
    with(name: string, constraint?: Constraint | null): this;
    /**
     * Query all relations.
     */
    withAll(constraints?: ConstraintCallback): this;
    /**
     * Query all relations recursively.
     */
    withAllRecursive(depth?: number): this;
    /**
     * Set where constraint based on relationship existence.
     */
    has(name: string, constraint?: number | string, count?: number): this;
    /**
     * Set where constraint based on relationship absence.
     */
    hasNot(name: string, constraint?: number | string, count?: number): this;
    /**
     * Add where constraints based on has or hasNot condition.
     */
    addHasConstraint(name: string, constraint?: number | string, count?: number, existence?: boolean): this;
    /**
     * Add where has condition.
     */
    whereHas(name: string, constraint: Constraint): this;
    /**
     * Add where has not condition.
     */
    whereHasNot(name: string, constraint: Constraint): this;
    /**
     * Add where has constraints that only matches the relationship constraint.
     */
    addWhereHasConstraint(name: string, constraint: Constraint, existence?: boolean): this;
    /**
     * Process the query and filter data.
     */
    process(): Record[];
    /**
     * Filter the given data by registered where clause.
     */
    selectByWheres(records: Record[]): Record[];
    /**
     * Sort the given data by registered orders.
     */
    sortByOrders(records: Record[]): Record[];
    /**
     * Checks if given Record matches the registered where clause.
     */
    whereOnRecord(record: Record): boolean;
    /**
     * Get comparator for the where clause.
     */
    getComparator(record: Record): (where: any) => boolean;
    /**
     * Execute where closure.
     */
    executeWhereClosure(record: Record, query: Query, closure: WherePrimaryClosure): boolean | void;
    /**
     * Get the count of the retrieved data.
     */
    count(): number;
    /**
     * Get the max value of the specified filed.
     */
    max(field: string): number;
    /**
     * Get the min value of the specified filed.
     */
    min(field: string): number;
    /**
     * Create a item from given record.
     */
    item(queryItem?: Record | null): Item;
    /**
     * Create a collection (array) from given records.
     */
    collect(collection: Record[]): Collection;
    /**
     * Load the relationships for the record.
     */
    loadRelations(data: Record[], relation?: Relation[]): Record[];
    /**
     * Process load relationships. This method is for the circuler processes.
     */
    processLoadRelations(data: Record[], relation: Relation, fields: Fields): Record[];
    /**
     * Check if the given collection has given relationship.
     */
    matchesHasRelation(name: string, constraint?: number | string, count?: number, existence?: boolean): string[];
    /**
     * Get all id of the record that matches the relation constraints.
     */
    matchesWhereHasRelation(name: string, constraint: Constraint, existence?: boolean): string[];
    /**
     * Delete records from the state.
     */
    delete(condition: Condition): Item | Collection;
    /**
     * Delete a record by id.
     */
    deleteById(id: string | number): Item;
    /**
     * Delete record by condition.
     */
    deleteByCondition(condition: Predicate): Collection;
    /**
     * Delete all records from the state.
     */
    deleteAll(): Collection;
    /**
     * Commit `delete` to the state.
     */
    commitDelete(ids: string[]): void;
}
