import { Query } from '../query';
var rootGetters = {
    /**
     * Create a new Query instance.
     */
    query: function (state) { return function (entity, wrap) {
        return Query.query(state, entity, wrap);
    }; },
    /**
     * Get all data of given entity.
     */
    all: function (state) { return function (entity, wrap) {
        return Query.all(state, entity, wrap);
    }; },
    /**
     * Find a data of the given entity by given id.
     */
    find: function (state) { return function (entity, id, wrap) {
        return Query.find(state, entity, id, wrap);
    }; }
};
export default rootGetters;
//# sourceMappingURL=rootGetters.js.map