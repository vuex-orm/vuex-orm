import * as Vuex from 'vuex';
import Modules from '../database/Modules';
import EntityState from './EntityState';
export default class Module {
    /**
     * The default state. This state will be merged with additional
     * entity's state if it has any.
     */
    static state(): EntityState;
    /**
     * Create module from the given entities.
     */
    static create(namespace: string, modules: Modules): Vuex.Module<any, any>;
    /**
     * Creates module tree to be registered under top level module
     * from the given entities.
     */
    static createTree(tree: any, namespace: string, modules: Modules): Vuex.Module<any, any>;
}
