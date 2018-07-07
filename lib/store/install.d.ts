import * as Vuex from 'vuex';
import Database from '../database/Database';
import { Options } from '../options/Options';
export declare type Install = (database: Database, options?: Options) => Vuex.Plugin<any>;
declare const _default: (database: Database, options: Options) => Vuex.Plugin<any>;
export default _default;
