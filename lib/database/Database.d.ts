import * as Vuex from 'vuex';
import Model from '../model/Model';
import Entity from './Entity';
import Modules from './Modules';
export default class Database {
    /**
     * The Vuex Store instance.
     */
    store?: Vuex.Store<any>;
    /**
     * The list of entities to be registered to the Vuex Store. It contains
     * models and modules with its name.
     */
    entities: Entity[];
    /**
     * Register a model and module to the entities list.
     */
    register(model: typeof Model, module: Vuex.Module<any, any>): void;
    /**
     * Get all modules from the entities list.
     */
    modules(): Modules;
    /**
     * Create the Vuex Module from registered entities.
     */
    createModule(namespace: string): Vuex.Module<any, any>;
    /**
     * Register a Vuex Store instance.
     */
    registerStore(store: Vuex.Store<any>): void;
    /**
     * Register namespace to the all regitsered model.
     */
    registerNamespace(namespace: string): void;
}
