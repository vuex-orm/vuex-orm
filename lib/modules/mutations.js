import Query from '../query/Query';
var mutations = {
    /**
     * Save new data to the state. It will remove all existing data in the
     * state. If you want to keep existing data while saving new data,
     * use `insert` instead.
     */
    create: function (state, _a) {
        var entity = _a.entity, data = _a.data, create = _a.create, insert = _a.insert, update = _a.update, insertOrUpdate = _a.insertOrUpdate;
        Query.create(state, entity, data, { create: create, insert: insert, update: update, insertOrUpdate: insertOrUpdate });
    },
    /**
     * Commit `create` to the state.
     */
    commitCreate: function (state, _a) {
        var entity = _a.entity, data = _a.data;
        Query.commitCreate(state, entity, data);
    },
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    insert: function (state, _a) {
        var entity = _a.entity, data = _a.data, create = _a.create, insert = _a.insert, update = _a.update, insertOrUpdate = _a.insertOrUpdate;
        Query.insert(state, entity, data, { create: create, insert: insert, update: update, insertOrUpdate: insertOrUpdate });
    },
    /**
     * Commit `insert` to the state.
     */
    commitInsert: function (state, _a) {
        var entity = _a.entity, data = _a.data;
        Query.commitInsert(state, entity, data);
    },
    /**
     * Update data in the store.
     */
    update: function (state, _a) {
        var entity = _a.entity, data = _a.data, where = _a.where, create = _a.create, insert = _a.insert, update = _a.update, insertOrUpdate = _a.insertOrUpdate;
        Query.update(state, entity, data, where, { create: create, insert: insert, update: update, insertOrUpdate: insertOrUpdate });
    },
    /**
     * Commit `create` to the state.
     */
    commitUpdate: function (state, _a) {
        var entity = _a.entity, data = _a.data;
        Query.commitUpdate(state, entity, data);
    },
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    insertOrUpdate: function (state, _a) {
        var entity = _a.entity, data = _a.data, create = _a.create;
        Query.insertOrUpdate(state, entity, data, create);
    },
    /**
     * Delete data from the store.
     */
    delete: function (state, _a) {
        var entity = _a.entity, where = _a.where;
        Query.delete(state, entity, where);
    },
    /**
     * Delete all data from the store.
     */
    deleteAll: function (state, payload) {
        if (payload && payload.entity) {
            Query.deleteAll(state, payload.entity);
            return;
        }
        Query.deleteAll(state);
    },
    /**
     * Commit `delete` to the state.
     */
    commitDelete: function (state, _a) {
        var entity = _a.entity, ids = _a.ids;
        Query.commitDelete(state, entity, ids);
    }
};
export default mutations;
//# sourceMappingURL=mutations.js.map