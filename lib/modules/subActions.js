var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var subActions = {
    /**
     * Save new data to the state. It will remove all existing data in the
     * state. If you want to keep existing data while saving new data,
     * use `insert` instead.
     */
    create: function (_a, payload) {
        var dispatch = _a.dispatch, state = _a.state;
        return dispatch(state.$connection + "/create", __assign({ entity: state.$name }, payload), { root: true });
    },
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    insert: function (_a, payload) {
        var dispatch = _a.dispatch, state = _a.state;
        return dispatch(state.$connection + "/insert", __assign({ entity: state.$name }, payload), { root: true });
    },
    /**
     * Update data in the store.
     */
    update: function (_a, payload) {
        var dispatch = _a.dispatch, state = _a.state;
        var where = payload.where, data = payload.data;
        if (where === undefined || data === undefined) {
            return dispatch(state.$connection + "/update", { entity: state.$name, data: payload }, { root: true });
        }
        return dispatch(state.$connection + "/update", __assign({ entity: state.$name }, payload), { root: true });
    },
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    insertOrUpdate: function (_a, payload) {
        var dispatch = _a.dispatch, state = _a.state;
        return dispatch(state.$connection + "/insertOrUpdate", __assign({ entity: state.$name }, payload), { root: true });
    },
    /**
     * Delete data from the store.
     */
    delete: function (_a, condition) {
        var dispatch = _a.dispatch, state = _a.state;
        var where = typeof condition === 'object' ? condition.where : condition;
        return dispatch(state.$connection + "/delete", { entity: state.$name, where: where }, { root: true });
    },
    /**
     * Delete all data from the store.
     */
    deleteAll: function (_a) {
        var dispatch = _a.dispatch, state = _a.state;
        dispatch(state.$connection + "/deleteAll", { entity: state.$name }, { root: true });
    }
};
export default subActions;
//# sourceMappingURL=subActions.js.map