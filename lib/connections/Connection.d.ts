import * as Vuex from 'vuex';
import Database from '../database/Database';
import BaseModel from '../model/BaseModel';
export default class Connection {
    /**
     * The database instance.
     */
    database: Database;
    /**
     * Creates a connection instance.
     */
    constructor(database: Database);
    /**
     * Get Vuex Store instance from the database.
     */
    store(): Vuex.Store<any>;
    /**
     * Get models from the database.
     */
    models(): {
        [entity: string]: typeof BaseModel;
    };
    /**
     * Find model in database by given name.
     */
    model(name: string): typeof BaseModel;
    /**
     * Get modules from the database.
     */
    modules(): {
        [entity: string]: Vuex.Module<any, any>;
    };
    /**
     * Find module in database by given name.
     */
    module(name: string): Vuex.Module<any, any>;
}
