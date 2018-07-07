import Query from '../query/Query';
var rootActions = {
    /**
     * Save new data to the state. It will remove all existing data in the
     * state. If you want to keep existing data while saving new data,
     * use `insert` instead.
     */
    create: function (context, _a) {
        var entity = _a.entity, data = _a.data, create = _a.create, insert = _a.insert, update = _a.update, insertOrUpdate = _a.insertOrUpdate;
        return (new Query(context.state, entity))
            .setActionContext(context)
            .create(data, { create: create, insert: insert, update: update, insertOrUpdate: insertOrUpdate });
    },
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    insert: function (context, _a) {
        var entity = _a.entity, data = _a.data, create = _a.create, insert = _a.insert, update = _a.update, insertOrUpdate = _a.insertOrUpdate;
        return (new Query(context.state, entity))
            .setActionContext(context)
            .insert(data, { create: create, insert: insert, update: update, insertOrUpdate: insertOrUpdate });
    },
    /**
     * Update data in the store.
     */
    update: function (context, _a) {
        var entity = _a.entity, where = _a.where, data = _a.data, create = _a.create, insert = _a.insert, update = _a.update, insertOrUpdate = _a.insertOrUpdate;
        return (new Query(context.state, entity))
            .setActionContext(context)
            .update(data, where, { create: create, insert: insert, update: update, insertOrUpdate: insertOrUpdate });
    },
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    insertOrUpdate: function (context, _a) {
        var entity = _a.entity, data = _a.data, create = _a.create, insert = _a.insert, update = _a.update, insertOrUpdate = _a.insertOrUpdate;
        return (new Query(context.state, entity))
            .setActionContext(context)
            .insertOrUpdate(data, { create: create, insert: insert, update: update, insertOrUpdate: insertOrUpdate });
    },
    /**
     * Delete data from the store.
     */
    delete: function (context, _a) {
        var entity = _a.entity, where = _a.where;
        return (new Query(context.state, entity)).setActionContext(context).delete(where);
    },
    /**
     * Delete all data from the store.
     */
    deleteAll: function (_a, payload) {
        var commit = _a.commit;
        commit('deleteAll', payload);
    }
};
export default rootActions;
//# sourceMappingURL=rootActions.js.map