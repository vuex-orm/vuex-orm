import * as Vuex from 'vuex';
import Model from '../model/Model';
export interface Entity {
    name: string;
    model: typeof Model;
    module: Vuex.Module<any, any>;
}
export default Entity;
