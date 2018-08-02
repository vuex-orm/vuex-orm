var subGetters = {
    /**
     * Create a new Query instance.
     */
    query: function (state, _getters, _rootState, rootGetters) { return function (wrap) {
        return rootGetters[state.$connection + "/query"](state.$name, wrap);
    }; },
    /**
     * Get all data of given entity.
     */
    all: function (state, _getters, _rootState, rootGetters) { return function (wrap) {
        return rootGetters[state.$connection + "/all"](state.$name, wrap);
    }; },
    /**
     * Find a data of the given entity by given id.
     */
    find: function (state, _getters, _rootState, rootGetters) { return function (id, wrap) {
        return rootGetters[state.$connection + "/find"](state.$name, id, wrap);
    }; }
};
export default subGetters;
//# sourceMappingURL=subGetters.js.map