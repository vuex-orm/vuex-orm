import * as Vuex from 'vuex';
export interface Entities {
    [name: string]: Vuex.Module<any, any>;
}
export default Entities;
