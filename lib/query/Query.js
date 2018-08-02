var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import Utils from '../support/Utils';
import Container from '../connections/Container';
import Data from '../data/Data';
import Attrs from '../attributes/contracts/Contract';
import Attribute from '../attributes/Attribute';
import RelationClass from '../attributes/relations/Relation';
import Hook from './Hook';
var Query = /** @class */ (function () {
    /**
     * Create a new Query instance.
     */
    function Query(state, entity, wrap) {
        if (wrap === void 0) { wrap = true; }
        /**
         * The where constraints for the query.
         */
        this.wheres = [];
        /**
         * The orders of the query result.
         */
        this.orders = [];
        /**
         * Number of results to skip.
         */
        this._offset = 0;
        /**
         * Maximum number of records to return.
         *
         * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
         */
        this._limit = Math.pow(2, 53) - 1;
        /**
         * The relationships that should be loaded with the result.
         */
        this.load = [];
        /**
         * The Vuex Action context.
         */
        this.actionContext = null;
        this.rootState = state;
        this.state = state[entity];
        this.entity = entity;
        this.model = this.getModel(entity);
        this.module = this.getModule(entity);
        this.hook = new Hook(this);
        this.wrap = wrap;
    }
    /**
     * Create a new query instance
     */
    Query.query = function (state, name, wrap) {
        return new this(state, name, wrap);
    };
    /**
     * Get model of given name from the container.
     */
    Query.getModel = function (state, name) {
        return Container.connection(state.$name).model(name);
    };
    /**
     * Get all models from the container.
     */
    Query.getModels = function (state) {
        return Container.connection(state.$name).models();
    };
    /**
     * Get module of given name from the container.
     */
    Query.getModule = function (state, name) {
        return Container.connection(state.$name).module(name);
    };
    /**
     * Get all modules from the container.
     */
    Query.getModules = function (state) {
        return Container.connection(state.$name).modules();
    };
    /**
     * Save new data to the state. It will remove all existing data in the
     * state. If you want to keep existing data while saving new data,
     * use `insert` instead.
     */
    Query.create = function (state, entity, data, options) {
        return (new this(state, entity)).create(data, options);
    };
    /**
     * Commit `create` to the state.
     */
    Query.commitCreate = function (state, entity, records) {
        (new this(state, entity)).commitCreate(records);
    };
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    Query.insert = function (state, entity, data, options) {
        return (new this(state, entity)).insert(data, options);
    };
    /**
     * Commit `insert` to the state.
     */
    Query.commitInsert = function (state, entity, data) {
        (new this(state, entity)).commitInsert(data);
    };
    /**
     * Update data in the state.
     */
    Query.update = function (state, entity, data, condition, options) {
        return (new this(state, entity)).update(data, condition, options);
    };
    /**
     * Commit `update` to the state.
     */
    Query.commitUpdate = function (state, entity, data) {
        (new this(state, entity)).commitUpdate(data);
    };
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    Query.insertOrUpdate = function (state, entity, data, options) {
        return (new this(state, entity)).insertOrUpdate(data, options);
    };
    /**
     * Get all data of the given entity from the state.
     */
    Query.all = function (state, entity, wrap) {
        return (new this(state, entity, wrap)).get();
    };
    /**
     * Get the record of the given id.
     */
    Query.find = function (state, entity, id, wrap) {
        return (new this(state, entity, wrap)).find(id);
    };
    /**
     * Get the count of the retrieved data.
     */
    Query.count = function (state, entity, wrap) {
        return (new this(state, entity, wrap)).count();
    };
    /**
     * Get the max value of the specified filed.
     */
    Query.max = function (state, entity, field, wrap) {
        return (new this(state, entity, wrap)).max(field);
    };
    /**
     * Get the min value of the specified filed.
     */
    Query.min = function (state, entity, field, wrap) {
        return (new this(state, entity, wrap)).min(field);
    };
    /**
     * Delete a record from the state.
     */
    Query.delete = function (state, entity, condition) {
        return (new this(state, entity)).delete(condition);
    };
    /**
     * Delete all records from the state.
     */
    Query.deleteAll = function (state, entity) {
        var _this = this;
        if (entity) {
            return (new this(state, entity)).deleteAll();
        }
        var models = this.getModels(state);
        Utils.forOwn(models, function (_model, name) {
            state[name] && (new _this(state, name)).deleteAll();
        });
    };
    /**
     * Commit `delete` to the state.
     */
    Query.commitDelete = function (state, entity, ids) {
        (new Query(state, entity)).commitDelete(ids);
    };
    /**
     * Register a callback. It Returns unique ID for registered callback.
     */
    Query.on = function (on, callback, once) {
        return Hook.on(on, callback, once);
    };
    /**
     * Remove hook registration.
     */
    Query.off = function (uid) {
        return Hook.off(uid);
    };
    /**
     * Get query class.
     */
    Query.prototype.self = function () {
        return this.constructor;
    };
    /**
     * Create a new query instance.
     */
    Query.prototype.newQuery = function (entity) {
        return (new Query(this.rootState, entity)).setActionContext(this.actionContext);
    };
    /**
     * Create a new query instance with wrap property set to false.
     */
    Query.prototype.newPlainQuery = function (entity) {
        return (new Query(this.rootState, entity)).plain();
    };
    /**
     * Get model of given name from the container.
     */
    Query.prototype.getModel = function (name) {
        var entity = name || this.entity;
        return this.self().getModel(this.rootState, entity);
    };
    /**
     * Get all models from the container.
     */
    Query.prototype.getModels = function () {
        return this.self().getModels(this.rootState);
    };
    /**
     * Get module of given name from the container.
     */
    Query.prototype.getModule = function (name) {
        var entity = name || this.entity;
        return this.self().getModule(this.rootState, entity);
    };
    /**
     * Get all modules from the container.
     */
    Query.prototype.getModules = function () {
        return this.self().getModules(this.rootState);
    };
    /**
     * Commit changes to the state. This method will call mutation name of
     * `method` with `payload` if the method is called from an action to
     * avoid mutating state change outside of mutation handler.
     */
    Query.prototype.commit = function (method, payload, callback) {
        if (!this.actionContext) {
            callback();
            return;
        }
        payload = __assign({ entity: this.entity }, payload);
        this.actionContext.commit(this.rootState.$name + "/" + method, payload, { root: true });
    };
    /**
     * Set wrap flag to false.
     */
    Query.prototype.plain = function () {
        this.wrap = false;
        return this;
    };
    /**
     * Set Vuex Action Context to the query.
     */
    Query.prototype.setActionContext = function (context) {
        this.actionContext = context;
        return this;
    };
    /**
     * Save new data to the state. It will remove all existing data in the
     * state. If you want to keep existing data while saving new data,
     * use `insert` instead.
     */
    Query.prototype.create = function (data, options) {
        return this.persist(data, 'create', options);
    };
    /**
     * Create records to the state.
     */
    Query.prototype.createMany = function (records) {
        records = this.model.hydrateMany(records);
        records = this.hook.executeOnRecords('beforeCreate', records);
        this.commitCreate(records);
        var collection = this.collect(this.records(records));
        return this.hook.executeOnCollection('afterCreate', collection);
    };
    /**
     * Commit `create` to the state.
     */
    Query.prototype.commitCreate = function (data) {
        var _this = this;
        this.commit('commitCreate', { data: data }, function () {
            _this.state.data = data;
        });
    };
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    Query.prototype.insert = function (data, options) {
        return this.persist(data, 'insert', options);
    };
    /**
     * Insert list of records in the state.
     */
    Query.prototype.insertMany = function (records) {
        records = this.model.hydrateMany(records);
        records = this.hook.executeOnRecords('beforeCreate', records);
        this.commitInsert(records);
        var collection = this.collect(this.records(records));
        return this.hook.executeOnCollection('afterCreate', collection);
    };
    /**
     * Commit `insert` to the state.
     */
    Query.prototype.commitInsert = function (data) {
        var _this = this;
        this.commit('commitInsert', { data: data }, function () {
            _this.state.data = __assign({}, _this.state.data, data);
        });
    };
    /**
     * Update data in the state.
     */
    Query.prototype.update = function (data, condition, options) {
        if (Array.isArray(data)) {
            return this.persist(data, 'update', options);
        }
        if (typeof condition === 'function') {
            return this.updateByCondition(data, condition);
        }
        if (!condition) {
            return this.persist(data, 'update', options);
        }
        return this.updateById(data, condition);
    };
    /**
     * Update all records.
     */
    Query.prototype.updateMany = function (records) {
        var _this = this;
        var toBeUpdated = {};
        records = this.model.fixMany(records, []);
        Utils.forOwn(records, function (record, id) {
            var state = _this.state.data[id];
            if (!state) {
                return;
            }
            var newState = JSON.parse(JSON.stringify(state));
            _this.merge(record, newState);
            toBeUpdated[id] = newState;
        });
        toBeUpdated = this.hook.executeOnRecords('beforeUpdate', toBeUpdated);
        this.commitUpdate(toBeUpdated);
        var collection = this.collect(this.records(toBeUpdated));
        this.hook.executeOnCollection('afterUpdate', collection);
        return collection;
    };
    /**
     * Update the state by id.
     */
    Query.prototype.updateById = function (data, id) {
        var _a;
        id = typeof id === 'number' ? id.toString() : id;
        var state = this.state.data[id];
        if (!state) {
            return null;
        }
        var record = JSON.parse(JSON.stringify(state));
        typeof data === 'function' ? data(record) : this.merge(this.model.fix(data), record);
        var hookResult = this.hook.execute('beforeUpdate', record);
        if (hookResult === false) {
            return null;
        }
        this.commitUpdate((_a = {}, _a[id] = hookResult, _a));
        var item = this.item(hookResult);
        this.hook.execute('afterUpdate', item);
        return item;
    };
    /**
     * Update the state by condition.
     */
    Query.prototype.updateByCondition = function (data, condition) {
        var _this = this;
        var toBeUpdated = {};
        Utils.forOwn(this.state.data, function (record, id) {
            if (!condition(record)) {
                return;
            }
            var state = JSON.parse(JSON.stringify(record));
            typeof data === 'function' ? data(state) : _this.merge(_this.model.fix(data), state);
            toBeUpdated[id] = state;
        });
        toBeUpdated = this.hook.executeOnRecords('beforeUpdate', toBeUpdated);
        this.commitUpdate(toBeUpdated);
        var collection = this.collect(this.records(toBeUpdated));
        this.hook.executeOnCollection('afterUpdate', collection);
        return collection;
    };
    /**
     * Commit `update` to the state.
     */
    Query.prototype.commitUpdate = function (data) {
        var _this = this;
        this.commit('commitUpdate', { data: data }, function () {
            _this.state.data = __assign({}, _this.state.data, data);
        });
    };
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    Query.prototype.insertOrUpdate = function (data, options) {
        return this.persist(data, 'insertOrUpdate', options);
    };
    /**
     * Insert or update the records.
     */
    Query.prototype.insertOrUpdateMany = function (records) {
        var _this = this;
        var toBeInserted = {};
        var toBeUpdated = {};
        Utils.forOwn(records, function (record, id) {
            if (_this.state.data[id]) {
                toBeUpdated[id] = record;
                return;
            }
            toBeInserted[id] = record;
        });
        return this.collect(this.insertMany(toBeInserted).concat(this.updateMany(toBeUpdated)));
    };
    /**
     * Persist data into the state.
     */
    Query.prototype.persist = function (data, method, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        data = this.normalize(data);
        if (Utils.isEmpty(data)) {
            method === 'create' && this.commitCreate({});
            return {};
        }
        return Object.keys(data).reduce(function (collection, entity) {
            var query = _this.newQuery(entity);
            var persistMethod = _this.getPersistMethod(entity, method, options);
            var records = query[persistMethod + "Many"](data[entity]);
            if (records.length > 0) {
                collection[entity] = records;
            }
            return collection;
        }, {});
    };
    /**
     * Get method for the persist.
     */
    Query.prototype.getPersistMethod = function (entity, method, options) {
        if (options.create && options.create.includes(entity)) {
            return 'create';
        }
        if (options.insert && options.insert.includes(entity)) {
            return 'insert';
        }
        if (options.update && options.update.includes(entity)) {
            return 'update';
        }
        if (options.insertOrUpdate && options.insertOrUpdate.includes(entity)) {
            return 'insertOrUpdate';
        }
        return method;
    };
    /**
     * Normalize the given data.
     */
    Query.prototype.normalize = function (data) {
        return Data.normalize(data, this);
    };
    /**
     * Update the state value by merging the given record and state.
     */
    Query.prototype.merge = function (data, state, fields) {
        var _this = this;
        var theFields = fields || this.model.fields();
        Utils.forOwn(data, function (value, key) {
            var field = theFields[key];
            if (field instanceof Attribute) {
                state[key] = value;
                return;
            }
            _this.merge(value, state[key], field);
        });
    };
    /**
     * Returns all record of the query chain result. This method is alias
     * of the `get` method.
     */
    Query.prototype.all = function () {
        return this.get();
    };
    /**
     * Get the record of the given id.
     */
    Query.prototype.find = function (id) {
        var record = this.state.data[id];
        if (!record) {
            return null;
        }
        return this.item(__assign({}, record));
    };
    /**
     * Returns all record of the query chain result.
     */
    Query.prototype.get = function () {
        var records = this.process();
        return this.collect(records);
    };
    /**
     * Returns the first record of the query chain result.
     */
    Query.prototype.first = function () {
        var records = this.process();
        return this.item(records[0]);
    };
    /**
     * Returns the last single record of the query chain result.
     */
    Query.prototype.last = function () {
        var records = this.process();
        var last = records.length - 1;
        return this.item(records[last]);
    };
    /**
     * Get all the records from the state and convert them into the array.
     * If you pass records, it will create an array out of that records
     * instead of the store state.
     */
    Query.prototype.records = function (records) {
        var theRecords = records || this.state.data;
        return Object.keys(theRecords).map(function (id) { return (__assign({}, theRecords[id])); });
    };
    /**
     * Add a and where clause to the query.
     */
    Query.prototype.where = function (field, value) {
        this.wheres.push({ field: field, value: value, boolean: 'and' });
        return this;
    };
    /**
     * Add a or where clause to the query.
     */
    Query.prototype.orWhere = function (field, value) {
        this.wheres.push({ field: field, value: value, boolean: 'or' });
        return this;
    };
    /**
     * Add an order to the query.
     */
    Query.prototype.orderBy = function (field, direction) {
        if (direction === void 0) { direction = 'asc'; }
        this.orders.push({ field: field, direction: direction });
        return this;
    };
    /**
     * Add an offset to the query.
     */
    Query.prototype.offset = function (offset) {
        this._offset = offset;
        return this;
    };
    /**
     * Add limit to the query.
     */
    Query.prototype.limit = function (limit) {
        this._limit = limit;
        return this;
    };
    /**
     * Set the relationships that should be loaded.
     */
    Query.prototype.with = function (name, constraint) {
        if (constraint === void 0) { constraint = null; }
        if (name === '*') {
            this.withAll();
        }
        else {
            this.load.push({ name: name, constraint: constraint });
        }
        return this;
    };
    /**
     * Query all relations.
     */
    Query.prototype.withAll = function (constraints) {
        if (constraints === void 0) { constraints = function () { return null; }; }
        var fields = this.model.fields();
        for (var field in fields) {
            if (Attrs.isRelation(fields[field])) {
                this.load.push({ name: field, constraint: constraints(field) });
            }
        }
        return this;
    };
    /**
     * Query all relations recursively.
     */
    Query.prototype.withAllRecursive = function (depth) {
        if (depth === void 0) { depth = 3; }
        this.withAll(function () {
            return depth > 0 ? function (query) {
                query.withAllRecursive(depth - 1);
            } : null;
        });
        return this;
    };
    /**
     * Set where constraint based on relationship existence.
     */
    Query.prototype.has = function (name, constraint, count) {
        return this.addHasConstraint(name, constraint, count, true);
    };
    /**
     * Set where constraint based on relationship absence.
     */
    Query.prototype.hasNot = function (name, constraint, count) {
        return this.addHasConstraint(name, constraint, count, false);
    };
    /**
     * Add where constraints based on has or hasNot condition.
     */
    Query.prototype.addHasConstraint = function (name, constraint, count, existence) {
        var ids = this.matchesHasRelation(name, constraint, count, existence);
        this.where('$id', function (value) { return ids.includes(value); });
        return this;
    };
    /**
     * Add where has condition.
     */
    Query.prototype.whereHas = function (name, constraint) {
        return this.addWhereHasConstraint(name, constraint, true);
    };
    /**
     * Add where has not condition.
     */
    Query.prototype.whereHasNot = function (name, constraint) {
        return this.addWhereHasConstraint(name, constraint, false);
    };
    /**
     * Add where has constraints that only matches the relationship constraint.
     */
    Query.prototype.addWhereHasConstraint = function (name, constraint, existence) {
        var ids = this.matchesWhereHasRelation(name, constraint, existence);
        this.where('$id', function (value) { return ids.includes(value); });
        return this;
    };
    /**
     * Process the query and filter data.
     */
    Query.prototype.process = function () {
        var records = this.records();
        // Process `beforeProcess` hook.
        records = this.hook.execute('beforeProcess', records);
        // If the where clause is registered, lets filter the records beased on it.
        if (!Utils.isEmpty(this.wheres)) {
            records = this.selectByWheres(records);
        }
        // Process `afterWhere` hook.
        records = this.hook.execute('afterWhere', records);
        // Next, lets sort the data if orderBy is registred.
        if (!Utils.isEmpty(this.orders)) {
            records = this.sortByOrders(records);
        }
        // Process `afterOrderBy` hook.
        records = this.hook.execute('afterOrderBy', records);
        // Finally, slice the record by limit and offset.
        records = records.slice(this._offset, this._offset + this._limit);
        // Process `afterLimit` hook.
        records = this.hook.execute('afterLimit', records);
        return records;
    };
    /**
     * Filter the given data by registered where clause.
     */
    Query.prototype.selectByWheres = function (records) {
        var _this = this;
        return records.filter(function (record) { return _this.whereOnRecord(record); });
    };
    /**
     * Sort the given data by registered orders.
     */
    Query.prototype.sortByOrders = function (records) {
        var keys = this.orders.map(function (order) { return order.field; });
        var directions = this.orders.map(function (order) { return order.direction; });
        return Utils.orderBy(records, keys, directions);
    };
    /**
     * Checks if given Record matches the registered where clause.
     */
    Query.prototype.whereOnRecord = function (record) {
        var whereTypes = Utils.groupBy(this.wheres, function (where) { return where.boolean; });
        var whereResults = [];
        var comparator = this.getComparator(record);
        if (whereTypes.and) {
            whereResults.push(whereTypes.and.every(comparator));
        }
        if (whereTypes.or) {
            whereResults.push(whereTypes.or.some(comparator));
        }
        return whereResults.indexOf(true) !== -1;
    };
    /**
     * Get comparator for the where clause.
     */
    Query.prototype.getComparator = function (record) {
        var _this = this;
        return function (where) {
            // Function with Record and Query as argument.
            if (typeof where.field === 'function') {
                var query = new Query(_this.rootState, _this.entity);
                var result = _this.executeWhereClosure(record, query, where.field);
                if (typeof result === 'boolean') {
                    return result;
                }
                return !Utils.isEmpty(query.where('$id', record['$id']).get());
            }
            // Function with Record value as argument.
            if (typeof where.value === 'function') {
                return where.value(record[where.field]);
            }
            // Check if field value is in given where Array.
            if (Array.isArray(where.value)) {
                return where.value.indexOf(record[where.field]) !== -1;
            }
            // Simple equal check.
            return record[where.field] === where.value;
        };
    };
    /**
     * Execute where closure.
     */
    Query.prototype.executeWhereClosure = function (record, query, closure) {
        if (closure.length !== 3) {
            return closure(record, query);
        }
        var model = new this.model(record);
        return closure(record, query, model);
    };
    /**
     * Get the count of the retrieved data.
     */
    Query.prototype.count = function () {
        // Do not wrap result data with class because it's unnecessary.
        this.wrap = false;
        return this.get().length;
    };
    /**
     * Get the max value of the specified filed.
     */
    Query.prototype.max = function (field) {
        // Do not wrap result data with class because it's unnecessary.
        this.wrap = false;
        var numbers = this.get().reduce(function (numbers, item) {
            if (typeof item[field] === 'number') {
                numbers.push(item[field]);
            }
            return numbers;
        }, []);
        return numbers.length === 0 ? 0 : Math.max.apply(Math, numbers);
    };
    /**
     * Get the min value of the specified filed.
     */
    Query.prototype.min = function (field) {
        // Do not wrap result data with class because it's unnecessary.
        this.wrap = false;
        var numbers = this.get().reduce(function (numbers, item) {
            if (typeof item[field] === 'number') {
                numbers.push(item[field]);
            }
            return numbers;
        }, []);
        return numbers.length === 0 ? 0 : Math.min.apply(Math, numbers);
    };
    /**
     * Create a item from given record.
     */
    Query.prototype.item = function (queryItem) {
        if (!queryItem) {
            return null;
        }
        var item = queryItem;
        if (!Utils.isEmpty(this.load)) {
            item = this.loadRelations([item])[0];
        }
        if (!this.wrap) {
            return item;
        }
        return new this.model(item);
    };
    /**
     * Create a collection (array) from given records.
     */
    Query.prototype.collect = function (collection) {
        var _this = this;
        if (Utils.isEmpty(collection)) {
            return [];
        }
        var item = collection;
        if (!Utils.isEmpty(this.load)) {
            item = this.loadRelations(item);
        }
        if (!this.wrap) {
            return item;
        }
        return item.map(function (data) { return new _this.model(data); });
    };
    /**
     * Load the relationships for the record.
     */
    Query.prototype.loadRelations = function (data, relation) {
        var _this = this;
        var _relation = relation || this.load;
        var fields = this.model.fields();
        return _relation.reduce(function (records, rel) {
            return _this.processLoadRelations(records, rel, fields);
        }, data);
    };
    /**
     * Process load relationships. This method is for the circuler processes.
     */
    Query.prototype.processLoadRelations = function (data, relation, fields) {
        var _this = this;
        var relationName = relation.name.split('.')[0];
        var collection = data;
        Object.keys(fields).some(function (key) {
            var field = fields[key];
            if (key === relationName) {
                if (field instanceof RelationClass) {
                    collection = field.load(_this, collection, relation);
                }
                return true;
            }
            if (field instanceof Attribute) {
                return false;
            }
            collection = _this.processLoadRelations(collection, relation, field);
            return false;
        });
        return collection;
    };
    /**
     * Check if the given collection has given relationship.
     */
    Query.prototype.matchesHasRelation = function (name, constraint, count, existence) {
        if (existence === void 0) { existence = true; }
        var _constraint;
        if (constraint === undefined) {
            _constraint = function (record) { return record.length >= 1; };
        }
        else if (typeof constraint === 'number') {
            _constraint = function (record) { return record.length >= constraint; };
        }
        else if (constraint === '=' && typeof count === 'number') {
            _constraint = function (record) { return record.length === count; };
        }
        else if (constraint === '>' && typeof count === 'number') {
            _constraint = function (record) { return record.length > count; };
        }
        else if (constraint === '>=' && typeof count === 'number') {
            _constraint = function (record) { return record.length >= count; };
        }
        else if (constraint === '<' && typeof count === 'number') {
            _constraint = function (record) { return record.length < count; };
        }
        else if (constraint === '<=' && typeof count === 'number') {
            _constraint = function (record) { return record.length <= count; };
        }
        var data = (new Query(this.rootState, this.entity, false)).with(name).get();
        var ids = [];
        data.forEach(function (item) {
            var target = item[name];
            var result = false;
            if (!target) {
                result = false;
            }
            else if (Array.isArray(target) && target.length < 1) {
                result = false;
            }
            else if (Array.isArray(target)) {
                result = _constraint(target);
            }
            else if (target) {
                result = _constraint([target]);
            }
            if (result !== existence) {
                return;
            }
            ids.push(item.$id);
        });
        return ids;
    };
    /**
     * Get all id of the record that matches the relation constraints.
     */
    Query.prototype.matchesWhereHasRelation = function (name, constraint, existence) {
        if (existence === void 0) { existence = true; }
        var data = (new Query(this.rootState, this.entity, false)).with(name, constraint).get();
        var ids = [];
        data.forEach(function (item) {
            var target = item[name];
            var result = Array.isArray(target) ? !!target.length : !!target;
            if (result !== existence) {
                return;
            }
            ids.push(item.$id);
        });
        return ids;
    };
    /**
     * Delete records from the state.
     */
    Query.prototype.delete = function (condition) {
        if (typeof condition === 'function') {
            return this.deleteByCondition(condition);
        }
        return this.deleteById(condition);
    };
    /**
     * Delete a record by id.
     */
    Query.prototype.deleteById = function (id) {
        id = typeof id === 'number' ? id.toString() : id;
        var state = this.state.data[id];
        if (!state) {
            return null;
        }
        var hookResult = this.hook.execute('beforeDelete', state);
        if (hookResult === false) {
            return null;
        }
        this.commitDelete([id]);
        var item = this.item(hookResult);
        this.hook.execute('afterDelete', item);
        return item;
    };
    /**
     * Delete record by condition.
     */
    Query.prototype.deleteByCondition = function (condition) {
        var toBeDeleted = {};
        Utils.forOwn(this.state.data, function (record, id) {
            if (!condition(record)) {
                return;
            }
            toBeDeleted[id] = record;
        });
        toBeDeleted = this.hook.executeOnRecords('beforeDelete', toBeDeleted);
        this.commitDelete(Object.keys(toBeDeleted));
        var collection = this.collect(this.records(toBeDeleted));
        this.hook.executeOnCollection('afterDelete', collection);
        return collection;
    };
    /**
     * Delete all records from the state.
     */
    Query.prototype.deleteAll = function () {
        var toBeDeleted = this.state.data;
        toBeDeleted = this.hook.executeOnRecords('beforeDelete', toBeDeleted);
        this.commitDelete(Object.keys(toBeDeleted));
        var collection = this.collect(this.records(toBeDeleted));
        this.hook.executeOnCollection('afterDelete', collection);
        return collection;
    };
    /**
     * Commit `delete` to the state.
     */
    Query.prototype.commitDelete = function (ids) {
        var _this = this;
        this.commit('commitDelete', { ids: ids }, function () {
            _this.state.data = Object.keys(_this.state.data).reduce(function (state, id) {
                if (!ids.includes(id)) {
                    state[id] = _this.state.data[id];
                }
                return state;
            }, {});
        });
    };
    return Query;
}());
export default Query;
//# sourceMappingURL=Query.js.map