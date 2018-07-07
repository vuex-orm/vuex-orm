var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Connection = /** @class */ (function () {
    /**
     * Creates a connection instance.
     */
    function Connection(database) {
        this.database = database;
    }
    /**
     * Get Vuex Store instance from the database.
     */
    Connection.prototype.store = function () {
        if (this.database.store === undefined) {
            throw new Error('Store instance is not registered to the database.');
        }
        return this.database.store;
    };
    /**
     * Get models from the database.
     */
    Connection.prototype.models = function () {
        return this.database.entities.reduce(function (models, entity) {
            var _a;
            return __assign({}, models, (_a = {}, _a[entity.model.entity] = entity.model, _a));
        }, {});
    };
    /**
     * Find model in database by given name.
     */
    Connection.prototype.model = function (name) {
        return this.models()[name];
    };
    /**
     * Get modules from the database.
     */
    Connection.prototype.modules = function () {
        return this.database.entities.reduce(function (modules, entity) {
            var _a;
            return __assign({}, modules, (_a = {}, _a[entity.model.entity] = entity.module, _a));
        }, {});
    };
    /**
     * Find module in database by given name.
     */
    Connection.prototype.module = function (name) {
        return this.modules()[name];
    };
    return Connection;
}());
export default Connection;
//# sourceMappingURL=Connection.js.map