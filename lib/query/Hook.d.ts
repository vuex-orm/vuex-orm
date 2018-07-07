import { Records } from '../data';
import Query from './Query';
import Collection from './Collection';
export interface GlobalHook {
    callback: Function;
    once?: boolean;
    uid: number;
}
export interface GlobalHooks {
    [on: string]: GlobalHook[];
}
export default class Hook {
    /**
     * Global lifecycle hooks for the query.
     */
    static hooks: GlobalHooks;
    /**
     * Hook UID counter.
     */
    static lastHookId: number;
    /**
     * The query instance.
     */
    query: Query;
    /**
     * Create a lidecycle hook instance.
     */
    constructor(query: Query);
    /**
     * Register a callback. It Returns unique ID for registered callback.
     */
    static on(on: string, callback: Function, once?: boolean): number;
    /**
     * Remove hook registration.
     */
    static off(uid: number): boolean;
    /**
     * Get the hook class.
     */
    self(): typeof Hook;
    /**
     * Get the action hook.
     */
    getActionHook(name: string): Function | null;
    /**
     * Get the global hook.
     */
    getGlobalHook(name: string): GlobalHook[] | null;
    /**
     * Check if the given hook exist.
     */
    has(name: string): boolean;
    /**
     * Execute the callback of the given hook.
     */
    execute(on: string, data: any): any;
    /**
     * Execute the action hook.
     */
    executeActionHook(on: string, data: any): any;
    /**
     * Execute the global callback of the given hook.
     */
    executeGlobalHook(on: string, data: any): any;
    /**
     * Execute the callback for all given records.
     */
    executeOnRecords(on: string, records: Records): Records;
    /**
     * Execute the callback for the given collection.
     */
    executeOnCollection(on: string, collection: Collection): Collection;
}
