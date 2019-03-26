(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.VuexORM = factory());
}(this, function () { 'use strict';

    /*eslint-disable */
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (search, pos) {
            return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
        };
    }
    if (!Array.prototype.includes) {
        Array.prototype.includes = function (searchElement) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var O = Object(this);
            var len = parseInt(O.length, 10) || 0;
            if (len === 0) {
                return false;
            }
            var n = args[1] || 0;
            var k;
            if (n >= 0) {
                k = n;
            }
            else {
                k = len + n;
                if (k < 0) {
                    k = 0;
                }
            }
            var currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) {
                    return true;
                }
                k++;
            }
            return false;
        };
    }
    if (!Object.values || !Object.entries) {
        var reduce_1 = Function.bind.call(Function.call, Array.prototype.reduce);
        var isEnumerable_1 = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
        var concat_1 = Function.bind.call(Function.call, Array.prototype.concat);
        var keys_1 = Reflect.ownKeys;
        if (!Object.values) {
            Object.values = function values(O) {
                return reduce_1(keys_1(O), function (v, k) { return concat_1(v, typeof k === 'string' && isEnumerable_1(O, k) ? [O[k]] : []); }, []);
            };
        }
        if (!Object.entries) {
            Object.entries = function entries(O) {
                return reduce_1(keys_1(O), function (e, k) { return concat_1(e, typeof k === 'string' && isEnumerable_1(O, k) ? [[k, O[k]]] : []); }, []);
            };
        }
    }

    var Container = /** @class */ (function () {
        function Container() {
        }
        /**
         * Register the database.
         */
        Container.register = function (database) {
            this.database = database;
        };
        return Container;
    }());

    var install = (function (database, options) {
        if (options === void 0) { options = {}; }
        var namespace = options.namespace || 'entities';
        return function (store) {
            Container.register(database);
            database.start(store, namespace);
        };
    });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
     * Check if the given array or object is empty.
     */
    function isEmpty(data) {
        if (Array.isArray(data)) {
            return data.length === 0;
        }
        return Object.keys(data).length === 0;
    }
    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property.
     */
    function forOwn(object, iteratee) {
        Object.keys(object).forEach(function (key) { return iteratee(object[key], key, object); });
    }
    /**
     * Create an array from the object.
     */
    function map(object, iteratee) {
        return Object.keys(object).map(function (key) {
            return iteratee(object[key], key, object);
        });
    }
    /**
     * Creates an object with the same keys as object and values generated by
     * running each own enumerable string keyed property of object thru
     * iteratee. The iteratee is invoked with three arguments:
     * (value, key, object).
     */
    function mapValues(object, iteratee) {
        var newObject = Object.assign({}, object);
        return Object.keys(object).reduce(function (records, key) {
            records[key] = iteratee(object[key], key, object);
            return records;
        }, newObject);
    }
    /**
     * Creates an object composed of the object properties predicate returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     */
    function pickBy(object, predicate) {
        return Object.keys(object).reduce(function (records, key) {
            var value = object[key];
            if (predicate(value, key)) {
                records[key] = value;
            }
            return records;
        }, {});
    }
    /**
     * Creates an array of elements, sorted in specified order by the results
     * of running each element in a collection thru each iteratee.
     */
    function orderBy(collection, keys, directions) {
        var index = -1;
        var result = collection.map(function (value) {
            var criteria = keys.map(function (key) { return value[key]; });
            return { criteria: criteria, index: ++index, value: value };
        });
        return baseSortBy(result, function (object, other) {
            return compareMultiple(object, other, directions);
        });
    }
    /**
     * Creates an object composed of keys generated from the results of running
     * each element of collection thru iteratee.
     */
    function groupBy(collection, iteratee) {
        return collection.reduce(function (records, record) {
            var key = iteratee(record);
            if (records[key] === undefined) {
                records[key] = [];
            }
            records[key].push(record);
            return records;
        }, {});
    }
    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define the
     * sort order of `array` and replaces criteria objects with their
     * corresponding values.
     */
    function baseSortBy(array, comparer) {
        var length = array.length;
        array.sort(comparer);
        while (length--) {
            array[length] = array[length].value;
        }
        return array;
    }
    /**
     * Used by `orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order.
     * Otherwise, specify an order of "desc" for descending or "asc" for
     * ascending sort order of corresponding values.
     */
    function compareMultiple(object, other, orders) {
        var objCriteria = object.criteria;
        var othCriteria = other.criteria;
        var length = objCriteria.length;
        var ordersLength = orders.length;
        var index = -1;
        while (++index < length) {
            var result = compareAscending(objCriteria[index], othCriteria[index]);
            if (result) {
                if (index >= ordersLength) {
                    return result;
                }
                var order = orders[index];
                return result * (order === 'desc' ? -1 : 1);
            }
        }
        return object.index - other.index;
    }
    /**
     * Compares values to sort them in ascending order.
     */
    function compareAscending(value, other) {
        if (value !== other) {
            if (value > other) {
                return 1;
            }
            if (value < other) {
                return -1;
            }
        }
        return 0;
    }
    var Utils = {
        isEmpty: isEmpty,
        forOwn: forOwn,
        groupBy: groupBy,
        map: map,
        mapValues: mapValues,
        orderBy: orderBy,
        pickBy: pickBy
    };

    var Attribute = /** @class */ (function () {
        /**
         * Create a new attribute instance.
         */
        function Attribute(model) {
            this.model = model;
        }
        return Attribute;
    }());

    var Type = /** @class */ (function (_super) {
        __extends(Type, _super);
        /**
         * Create a new type instance.
         */
        function Type(model, value, mutator) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            /**
             * Whether if the attribute can accept `null` as a value.
             */
            _this.isNullable = false;
            _this.value = value;
            _this.mutator = mutator;
            return _this;
        }
        /**
         * Set `isNullable` to be `true`.
         */
        Type.prototype.nullable = function () {
            this.isNullable = true;
            return this;
        };
        /**
         * Mutate the given value by mutator.
         */
        Type.prototype.mutate = function (value, key) {
            var mutator = this.mutator || this.model.mutators()[key];
            return mutator ? mutator(value) : value;
        };
        return Type;
    }(Attribute));

    var Attr = /** @class */ (function (_super) {
        __extends(Attr, _super);
        /**
         * Create a new attr instance.
         */
        function Attr(model, value, mutator) {
            var _this = _super.call(this, model, value, mutator) /* istanbul ignore next */ || this;
            _this.value = value;
            return _this;
        }
        /**
         * Make value to be set to model property. This method is used when
         * instantiating a model or creating a plain object from a model.
         */
        Attr.prototype.make = function (value, _parent, key) {
            value = value !== undefined ? value : this.value;
            return this.mutate(value, key);
        };
        return Attr;
    }(Type));

    var Increment = /** @class */ (function (_super) {
        __extends(Increment, _super);
        /**
         * Create a new increment instance.
         */
        function Increment(model) {
            /* istanbul ignore next */
            return _super.call(this, model, null) || this;
        }
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        Increment.prototype.make = function (value, _parent, _key) {
            return typeof value === 'number' ? value : null;
        };
        return Increment;
    }(Type));

    var String$1 = /** @class */ (function (_super) {
        __extends(String, _super);
        /**
         * Create a new string instance.
         */
        function String(model, value, mutator) {
            /* istanbul ignore next */
            return _super.call(this, model, value, mutator) || this;
        }
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        String.prototype.make = function (value, _parent, key) {
            return this.mutate(this.fix(value), key);
        };
        /**
         * Convert given value to the string.
         */
        String.prototype.fix = function (value) {
            if (value === undefined) {
                return this.value;
            }
            if (typeof value === 'string') {
                return value;
            }
            if (value === null && this.isNullable) {
                return value;
            }
            return value + '';
        };
        return String;
    }(Type));

    var Number = /** @class */ (function (_super) {
        __extends(Number, _super);
        /**
         * Create a new number instance.
         */
        function Number(model, value, mutator) {
            /* istanbul ignore next */
            return _super.call(this, model, value, mutator) || this;
        }
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        Number.prototype.make = function (value, _parent, key) {
            return this.mutate(this.fix(value), key);
        };
        /**
         * Transform given data to the number.
         */
        Number.prototype.fix = function (value) {
            if (value === undefined) {
                return this.value;
            }
            if (typeof value === 'number') {
                return value;
            }
            if (typeof value === 'string') {
                return parseFloat(value);
            }
            if (typeof value === 'boolean') {
                return value ? 1 : 0;
            }
            if (value === null && this.isNullable) {
                return value;
            }
            return 0;
        };
        return Number;
    }(Type));

    var Boolean = /** @class */ (function (_super) {
        __extends(Boolean, _super);
        /**
         * Create a new number instance.
         */
        function Boolean(model, value, mutator) {
            /* istanbul ignore next */
            return _super.call(this, model, value, mutator) || this;
        }
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        Boolean.prototype.make = function (value, _parent, key) {
            return this.mutate(this.fix(value), key);
        };
        /**
         * Transform given data to the boolean.
         */
        Boolean.prototype.fix = function (value) {
            if (value === undefined) {
                return this.value;
            }
            if (typeof value === 'boolean') {
                return value;
            }
            if (typeof value === 'string') {
                if (value.length === 0) {
                    return false;
                }
                var int = parseInt(value, 0);
                return isNaN(int) ? true : !!int;
            }
            if (typeof value === 'number') {
                return !!value;
            }
            if (value === null && this.isNullable) {
                return value;
            }
            return false;
        };
        return Boolean;
    }(Type));

    var Relation = /** @class */ (function (_super) {
        __extends(Relation, _super);
        function Relation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Get relation query instance with constraint attached.
         */
        Relation.prototype.getRelation = function (query, name, constraints) {
            var relation = query.newQuery(name);
            constraints.forEach(function (constraint) { constraint(relation); });
            return relation;
        };
        /**
         * Get specified keys from the given collection.
         */
        Relation.prototype.getKeys = function (collection, key) {
            return collection.map(function (model) { return model[key]; });
        };
        /**
         * Create a new indexed map for the single relation by specified key.
         */
        Relation.prototype.mapSingleRelations = function (collection, key) {
            return collection.reduce(function (records, record) {
                var id = record[key];
                records[id] = record;
                return records;
            }, {});
        };
        /**
         * Create a new indexed map for the many relation by specified key.
         */
        Relation.prototype.mapManyRelations = function (collection, key) {
            return collection.reduce(function (records, record) {
                var id = record[key];
                if (!records[id]) {
                    records[id] = [];
                }
                records[id].push(record);
                return records;
            }, {});
        };
        /**
         * Check if the given value is a single relation, which is the Object.
         */
        Relation.prototype.isOneRelation = function (record) {
            if (!Array.isArray(record) && record !== null && typeof record === 'object') {
                return true;
            }
            return false;
        };
        /**
         * Check if the given value is a single relation, which is the Object.
         */
        Relation.prototype.isManyRelation = function (records) {
            if (!Array.isArray(records)) {
                return false;
            }
            if (records.length < 1) {
                return false;
            }
            return true;
        };
        /**
         * Convert given records to the collection.
         */
        Relation.prototype.makeManyRelation = function (records, model) {
            var _this = this;
            if (!this.isManyRelation(records)) {
                return [];
            }
            return records.filter(function (record) {
                return _this.isOneRelation(record);
            }).map(function (record) {
                return new model(record);
            });
        };
        return Relation;
    }(Attribute));

    var HasOne = /** @class */ (function (_super) {
        __extends(HasOne, _super);
        /**
         * Create a new has one instance.
         */
        function HasOne(model, related, foreignKey, localKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.foreignKey = foreignKey;
            _this.localKey = localKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        HasOne.prototype.define = function (schema) {
            return schema.one(this.related);
        };
        /**
         * Attach the relational key to the related data. For example,
         * when User has one Phone, it will attach value to the
         * `user_id` field of Phone record.
         */
        HasOne.prototype.attach = function (key, record, data) {
            // Get related record.
            var related = data[this.related.entity];
            // If there's no related record, there's nothing we can do so return here.
            if (!related || !related[key]) {
                return;
            }
            // If there is a related record, check if the related record already has
            // proper foreign key value. If it has, that means the user has provided
            // the foreign key themselves so leave it alone and do nothing.
            if (related[key][this.foreignKey] !== undefined) {
                return;
            }
            // Check if the record has local key set. If not, set the local key to be
            // the id value. This happens if the user defines the custom local key
            // and didn't include it in the data being normalized.
            if (!record[this.localKey]) {
                record[this.localKey] = record.$id;
            }
            // Finally, set the foreign key of the related record to be the local
            // key of this record.
            related[key][this.foreignKey] = record[this.localKey];
        };
        /**
         * Make value to be set to model property. This method is used when
         * instantiating a model or creating a plain object from a model.
         */
        HasOne.prototype.make = function (value, _parent, _key) {
            if (!this.isOneRelation(value)) {
                return null;
            }
            return new this.related(value);
        };
        /**
         * Load the has one relationship for the collection.
         */
        HasOne.prototype.load = function (query, collection, name, constraints) {
            var relation = this.getRelation(query, this.related.entity, constraints);
            this.addEagerConstraints(relation, collection);
            this.match(collection, relation.get(), name);
        };
        /**
         * Set the constraints for an eager load of the relation.
         */
        HasOne.prototype.addEagerConstraints = function (relation, collection) {
            relation.whereFk(this.foreignKey, this.getKeys(collection, this.localKey));
        };
        /**
         * Match the eagerly loaded results to their parents.
         */
        HasOne.prototype.match = function (collection, relations, name) {
            var _this = this;
            var dictionary = this.buildDictionary(relations);
            collection.forEach(function (model) {
                var id = model[_this.localKey];
                var relation = dictionary[id];
                model[name] = relation || null;
            });
        };
        /**
         * Build model dictionary keyed by the relation's foreign key.
         */
        HasOne.prototype.buildDictionary = function (relations) {
            var _this = this;
            return relations.reduce(function (dictionary, relation) {
                var key = relation[_this.foreignKey];
                dictionary[key] = relation;
                return dictionary;
            }, {});
        };
        return HasOne;
    }(Relation));

    var BelongsTo = /** @class */ (function (_super) {
        __extends(BelongsTo, _super);
        /**
         * Create a new belongs to instance.
         */
        function BelongsTo(model, parent, foreignKey, ownerKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.parent = _this.model.relation(parent);
            _this.foreignKey = foreignKey;
            _this.ownerKey = ownerKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        BelongsTo.prototype.define = function (schema) {
            return schema.one(this.parent);
        };
        /**
         * Attach the relational key to the given data. For example,
         * when Post belongs to User, it will attach value to the
         * `user_id` field of Post record.
         */
        BelongsTo.prototype.attach = function (key, record, _data) {
            // See if the record has the foreign key, if yes, it means the user has
            // provided the key explicitly so do nothing and return.
            if (record[this.foreignKey] !== undefined) {
                return;
            }
            // If there is no foreign key, let's set it here.
            record[this.foreignKey] = key;
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        BelongsTo.prototype.make = function (value, _parent, _key) {
            if (!this.isOneRelation(value)) {
                return null;
            }
            return new this.parent(value);
        };
        /**
         * Load the belongs to relationship for the collection.
         */
        BelongsTo.prototype.load = function (query, collection, name, constraints) {
            var relation = this.getRelation(query, this.parent.entity, constraints);
            this.addEagerConstraints(relation, collection);
            this.match(collection, relation.get(), name);
        };
        /**
         * Set the constraints for an eager load of the relation.
         */
        BelongsTo.prototype.addEagerConstraints = function (relation, collection) {
            relation.whereFk(this.ownerKey, this.getKeys(collection, this.foreignKey));
        };
        /**
         * Match the eagerly loaded results to their parents.
         */
        BelongsTo.prototype.match = function (collection, relations, name) {
            var _this = this;
            var dictionary = this.buildDictionary(relations);
            collection.forEach(function (model) {
                var id = model[_this.foreignKey];
                var relation = id !== null ? dictionary[id] : null;
                model[name] = relation || null;
            });
        };
        /**
         * Build model dictionary keyed by the relation's foreign key.
         */
        BelongsTo.prototype.buildDictionary = function (relations) {
            var _this = this;
            return relations.reduce(function (dictionary, relation) {
                var key = relation[_this.ownerKey];
                dictionary[key] = relation;
                return dictionary;
            }, {});
        };
        return BelongsTo;
    }(Relation));

    var HasMany = /** @class */ (function (_super) {
        __extends(HasMany, _super);
        /**
         * Create a new has many instance.
         */
        function HasMany(model, related, foreignKey, localKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.foreignKey = foreignKey;
            _this.localKey = localKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        HasMany.prototype.define = function (schema) {
            return schema.many(this.related);
        };
        /**
         * Attach the relational key to the given data.
         */
        HasMany.prototype.attach = function (key, record, data) {
            var _this = this;
            if (!Array.isArray(key)) {
                return;
            }
            key.forEach(function (index) {
                var related = data[_this.related.entity];
                if (!related || !related[index] || related[index][_this.foreignKey] !== undefined) {
                    return;
                }
                related[index][_this.foreignKey] = record[_this.localKey];
            });
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        HasMany.prototype.make = function (value, _parent, _key) {
            return this.makeManyRelation(value, this.related);
        };
        /**
         * Load the has many relationship for the collection.
         */
        HasMany.prototype.load = function (query, collection, name, constraints) {
            var relation = this.getRelation(query, this.related.entity, constraints);
            this.addEagerConstraints(relation, collection);
            this.match(collection, relation.get(), name);
        };
        /**
         * Set the constraints for an eager load of the relation.
         */
        HasMany.prototype.addEagerConstraints = function (relation, collection) {
            relation.whereFk(this.foreignKey, this.getKeys(collection, this.localKey));
        };
        /**
         * Match the eagerly loaded results to their parents.
         */
        HasMany.prototype.match = function (collection, relations, name) {
            var _this = this;
            var dictionary = this.buildDictionary(relations);
            collection.forEach(function (model) {
                var id = model[_this.localKey];
                var relation = dictionary[id];
                model[name] = relation || [];
            });
        };
        /**
         * Build model dictionary keyed by the relation's foreign key.
         */
        HasMany.prototype.buildDictionary = function (relations) {
            var _this = this;
            return relations.reduce(function (dictionary, relation) {
                var key = relation[_this.foreignKey];
                if (!dictionary[key]) {
                    dictionary[key] = [];
                }
                dictionary[key].push(relation);
                return dictionary;
            }, {});
        };
        return HasMany;
    }(Relation));

    var HasManyBy = /** @class */ (function (_super) {
        __extends(HasManyBy, _super);
        /**
         * Create a new has many by instance.
         */
        function HasManyBy(model, parent, foreignKey, ownerKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.parent = _this.model.relation(parent);
            _this.foreignKey = foreignKey;
            _this.ownerKey = ownerKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        HasManyBy.prototype.define = function (schema) {
            return schema.many(this.parent);
        };
        /**
         * Attach the relational key to the given data.
         */
        HasManyBy.prototype.attach = function (key, record, _data) {
            if (key.length === 0) {
                return;
            }
            if (record[this.foreignKey] !== undefined) {
                return;
            }
            record[this.foreignKey] = key;
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        HasManyBy.prototype.make = function (value, _parent, _key) {
            return this.makeManyRelation(value, this.parent);
        };
        /**
         * Load the has many by relationship for the collection.
         */
        HasManyBy.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var relatedQuery = this.getRelation(query, this.parent.entity, constraints);
            this.addConstraintForHasManyBy(relatedQuery, collection);
            var relations = this.mapSingleRelations(relatedQuery.get(), this.ownerKey);
            collection.forEach(function (item) {
                var related = _this.getRelatedRecords(relations, item[_this.foreignKey]);
                item[name] = related;
            });
        };
        /**
         * Set the constraints for an eager load of the relation.
         */
        HasManyBy.prototype.addConstraintForHasManyBy = function (query, collection) {
            var _this = this;
            var keys = collection.reduce(function (keys, item) {
                return keys.concat(item[_this.foreignKey]);
            }, []);
            query.where(this.ownerKey, keys);
        };
        /**
         * Get related records.
         */
        HasManyBy.prototype.getRelatedRecords = function (records, keys) {
            return keys.reduce(function (items, id) {
                var related = records[id];
                related && items.push(related);
                return items;
            }, []);
        };
        return HasManyBy;
    }(Relation));

    var HasManyThrough = /** @class */ (function (_super) {
        __extends(HasManyThrough, _super);
        /**
         * Create a new has many through instance.
         */
        function HasManyThrough(model, related, through, firstKey, secondKey, localKey, secondLocalKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.through = _this.model.relation(through);
            _this.firstKey = firstKey;
            _this.secondKey = secondKey;
            _this.localKey = localKey;
            _this.secondLocalKey = secondLocalKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        HasManyThrough.prototype.define = function (schema) {
            return schema.many(this.related);
        };
        /**
         * Attach the relational key to the given data. Since has many through
         * relationship doesn't have any foreign key, it would do nothing.
         */
        HasManyThrough.prototype.attach = function (_key, _record, _data) {
            return;
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        HasManyThrough.prototype.make = function (value, _parent, _key) {
            return this.makeManyRelation(value, this.related);
        };
        /**
         * Load the has many through relationship for the collection.
         */
        HasManyThrough.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var relatedQuery = this.getRelation(query, this.related.entity, constraints);
            var throughQuery = query.newQuery(this.through.entity);
            this.addEagerConstraintForThrough(throughQuery, collection);
            var throughs = throughQuery.get();
            this.addEagerConstraintForRelated(relatedQuery, throughs);
            var relateds = this.mapThroughRelations(throughs, relatedQuery);
            collection.forEach(function (item) {
                var related = relateds[item[_this.localKey]];
                item[name] = related || [];
            });
        };
        /**
         * Set the constraints for the through relation.
         */
        HasManyThrough.prototype.addEagerConstraintForThrough = function (query, collection) {
            query.where(this.firstKey, this.getKeys(collection, this.localKey));
        };
        /**
         * Set the constraints for the related relation.
         */
        HasManyThrough.prototype.addEagerConstraintForRelated = function (query, collection) {
            query.where(this.secondKey, this.getKeys(collection, this.secondLocalKey));
        };
        /**
         * Create a new indexed map for the through relation.
         */
        HasManyThrough.prototype.mapThroughRelations = function (throughs, relatedQuery) {
            var _this = this;
            var relateds = this.mapManyRelations(relatedQuery.get(), this.secondKey);
            return throughs.reduce(function (records, record) {
                var id = record[_this.firstKey];
                if (!records[id]) {
                    records[id] = [];
                }
                var related = relateds[record[_this.secondLocalKey]];
                records[id] = records[id].concat(related);
                return records;
            }, {});
        };
        return HasManyThrough;
    }(Relation));

    var BelongsToMany = /** @class */ (function (_super) {
        __extends(BelongsToMany, _super);
        /**
         * Create a new belongs to instance.
         */
        function BelongsToMany(model, related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.pivot = _this.model.relation(pivot);
            _this.foreignPivotKey = foreignPivotKey;
            _this.relatedPivotKey = relatedPivotKey;
            _this.parentKey = parentKey;
            _this.relatedKey = relatedKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        BelongsToMany.prototype.define = function (schema) {
            return schema.many(this.related);
        };
        /**
         * Attach the relational key to the given data. Since belongs to many
         * relationship doesn't have any foreign key, it would do nothing.
         */
        BelongsToMany.prototype.attach = function (_key, _record, _data) {
            return;
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        BelongsToMany.prototype.make = function (value, _parent, _key) {
            return this.makeManyRelation(value, this.related);
        };
        /**
         * Load the belongs to relationship for the record.
         */
        BelongsToMany.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var relatedQuery = this.getRelation(query, this.related.entity, constraints);
            var pivotQuery = query.newQuery(this.pivot.entity);
            this.addEagerConstraintForPivot(pivotQuery, collection);
            var pivots = pivotQuery.get();
            this.addEagerConstraintForRelated(relatedQuery, pivots);
            var relateds = this.mapPivotRelations(pivots, relatedQuery);
            collection.forEach(function (item) {
                var related = relateds[item[_this.parentKey]];
                item[name] = related || [];
            });
        };
        /**
         * Set the constraints for the pivot relation.
         */
        BelongsToMany.prototype.addEagerConstraintForPivot = function (query, collection) {
            query.whereFk(this.foreignPivotKey, this.getKeys(collection, this.parentKey));
        };
        /**
         * Set the constraints for the related relation.
         */
        BelongsToMany.prototype.addEagerConstraintForRelated = function (query, collection) {
            query.whereFk(this.relatedKey, this.getKeys(collection, this.relatedPivotKey));
        };
        /**
         * Create a new indexed map for the pivot relation.
         */
        BelongsToMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
            var _this = this;
            var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
            return pivots.reduce(function (records, record) {
                var id = record[_this.foreignPivotKey];
                if (!records[id]) {
                    records[id] = [];
                }
                var related = relateds[record[_this.relatedPivotKey]];
                if (related) {
                    records[id] = records[id].concat(related);
                }
                return records;
            }, {});
        };
        /**
         * Create pivot records for the given records if needed.
         */
        BelongsToMany.prototype.createPivots = function (parent, data, key) {
            var _this = this;
            if (this.pivot.primaryKey instanceof Array === false)
                return data;
            Utils.forOwn(data[parent.entity], function (record) {
                var related = record[key];
                if (related === undefined || related.length === 0) {
                    return;
                }
                _this.createPivotRecord(data, record, related);
            });
            return data;
        };
        /**
         * Create a pivot record.
         */
        BelongsToMany.prototype.createPivotRecord = function (data, record, related) {
            var _this = this;
            related.forEach(function (id) {
                var _a, _b;
                var pivotKey = id + "_" + record[_this.parentKey];
                var pivotRecord = data[_this.pivot.entity] ? data[_this.pivot.entity][pivotKey] : {};
                data[_this.pivot.entity] = __assign({}, data[_this.pivot.entity], (_a = {}, _a[pivotKey] = __assign({}, pivotRecord, (_b = { $id: pivotKey }, _b[_this.foreignPivotKey] = record[_this.parentKey], _b[_this.relatedPivotKey] = id, _b)), _a));
            });
        };
        return BelongsToMany;
    }(Relation));

    var MorphTo = /** @class */ (function (_super) {
        __extends(MorphTo, _super);
        /**
         * Create a new morph to instance.
         */
        function MorphTo(model, id, type) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.id = id;
            _this.type = type;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        MorphTo.prototype.define = function (schema) {
            var _this = this;
            return schema.union(function (_value, parentValue) { return parentValue[_this.type]; });
        };
        /**
         * Attach the relational key to the given record. Since morph to
         * relationship doesn't have any foreign key, it would do nothing.
         */
        MorphTo.prototype.attach = function (_key, _record, _data) {
            return;
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        MorphTo.prototype.make = function (value, parent, _key) {
            if (!this.isOneRelation(value)) {
                return null;
            }
            var related = parent[this.type];
            var model = this.model.relation(related);
            return model ? new model(value) : null;
        };
        /**
         * Load the morph to relationship for the collection.
         */
        MorphTo.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var types = this.getTypes(collection);
            var relateds = types.reduce(function (relateds, type) {
                var relatedQuery = _this.getRelation(query, type, constraints);
                relateds[type] = _this.mapSingleRelations(relatedQuery.get(), '$id');
                return relateds;
            }, {});
            collection.forEach(function (item) {
                var id = item[_this.id];
                var type = item[_this.type];
                var related = relateds[type][id];
                item[name] = related || null;
            });
        };
        /**
         * Get all types from the collection.
         */
        MorphTo.prototype.getTypes = function (collection) {
            var _this = this;
            return collection.reduce(function (types, item) {
                var type = item[_this.type];
                !types.includes(type) && types.push(type);
                return types;
            }, []);
        };
        return MorphTo;
    }(Relation));

    var MorphOne = /** @class */ (function (_super) {
        __extends(MorphOne, _super);
        /**
         * Create a new belongs to instance.
         */
        function MorphOne(model, related, id, type, localKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.id = id;
            _this.type = type;
            _this.localKey = localKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        MorphOne.prototype.define = function (schema) {
            return schema.one(this.related);
        };
        /**
         * Attach the relational key to the given data.
         */
        MorphOne.prototype.attach = function (key, record, data) {
            var relatedItem = data[this.related.entity] && data[this.related.entity][key];
            if (!relatedItem) {
                return;
            }
            relatedItem[this.id] = relatedItem[this.id] || record.$id;
            relatedItem[this.type] = relatedItem[this.type] || this.model.entity;
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        MorphOne.prototype.make = function (value, _parent, _key) {
            if (!this.isOneRelation(value)) {
                return null;
            }
            return new this.related(value);
        };
        /**
         * Load the morph many relationship for the record.
         */
        MorphOne.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var relatedQuery = this.getRelation(query, this.related.entity, constraints);
            this.addEagerConstraintForMorphOne(relatedQuery, collection, query.entity);
            var relations = this.mapSingleRelations(relatedQuery.get(), this.id);
            collection.forEach(function (item) {
                var related = relations[item[_this.localKey]];
                item[name] = related || null;
            });
        };
        /**
         * Set the constraints for an eager load of the relation.
         */
        MorphOne.prototype.addEagerConstraintForMorphOne = function (query, collection, type) {
            query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.localKey));
        };
        return MorphOne;
    }(Relation));

    var MorphMany = /** @class */ (function (_super) {
        __extends(MorphMany, _super);
        /**
         * Create a new belongs to instance.
         */
        function MorphMany(model, related, id, type, localKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.id = id;
            _this.type = type;
            _this.localKey = localKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        MorphMany.prototype.define = function (schema) {
            return schema.many(this.related);
        };
        /**
         * Attach the relational key to the given data.
         */
        MorphMany.prototype.attach = function (key, record, data) {
            var _this = this;
            if (!Array.isArray(key)) {
                return;
            }
            var relatedItems = data[this.related.entity];
            key.forEach(function (id) {
                var relatedItem = relatedItems[id];
                relatedItem[_this.id] = relatedItem[_this.id] || record.$id;
                relatedItem[_this.type] = relatedItem[_this.type] || _this.model.entity;
            });
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        MorphMany.prototype.make = function (value, _parent, _key) {
            return this.makeManyRelation(value, this.related);
        };
        /**
         * Load the morph many relationship for the record.
         */
        MorphMany.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var relatedQuery = this.getRelation(query, this.related.entity, constraints);
            this.addEagerConstraintForMorphMany(relatedQuery, collection, query.entity);
            var relations = this.mapManyRelations(relatedQuery.get(), this.id);
            collection.forEach(function (item) {
                var related = relations[item[_this.localKey]];
                item[name] = related || [];
            });
        };
        /**
         * Set the constraints for an eager load of the relation.
         */
        MorphMany.prototype.addEagerConstraintForMorphMany = function (query, collection, type) {
            query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.localKey));
        };
        return MorphMany;
    }(Relation));

    var MorphToMany = /** @class */ (function (_super) {
        __extends(MorphToMany, _super);
        /**
         * Create a new belongs to instance.
         */
        function MorphToMany(model, related, pivot, relatedId, id, type, parentKey, relatedKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.pivot = _this.model.relation(pivot);
            _this.relatedId = relatedId;
            _this.id = id;
            _this.type = type;
            _this.parentKey = parentKey;
            _this.relatedKey = relatedKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        MorphToMany.prototype.define = function (schema) {
            return schema.many(this.related);
        };
        /**
         * Attach the relational key to the given record. Since morph to many
         * relationship doesn't have any foreign key, it would do nothing.
         */
        MorphToMany.prototype.attach = function (_key, _record, _data) {
            return;
        };
        /**
         * Convert given value to the appropriate value for the attribute.
         */
        MorphToMany.prototype.make = function (value, _parent, _key) {
            return this.makeManyRelation(value, this.related);
        };
        /**
         * Load the morph to many relationship for the collection.
         */
        MorphToMany.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var relatedQuery = this.getRelation(query, this.related.entity, constraints);
            var pivotQuery = query.newQuery(this.pivot.entity);
            this.addEagerConstraintForPivot(pivotQuery, collection, query.entity);
            var pivots = pivotQuery.get();
            this.addEagerConstraintForRelated(relatedQuery, pivots);
            var relateds = this.mapPivotRelations(pivots, relatedQuery);
            collection.forEach(function (item) {
                var related = relateds[item[_this.parentKey]];
                item[name] = related || [];
            });
        };
        /**
         * Set the constraints for the pivot relation.
         */
        MorphToMany.prototype.addEagerConstraintForPivot = function (query, collection, type) {
            query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.parentKey));
        };
        /**
         * Set the constraints for the related relation.
         */
        MorphToMany.prototype.addEagerConstraintForRelated = function (query, collection) {
            query.whereFk(this.relatedKey, this.getKeys(collection, this.relatedId));
        };
        /**
         * Create a new indexed map for the pivot relation.
         */
        MorphToMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
            var _this = this;
            var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
            return pivots.reduce(function (records, record) {
                var id = record[_this.id];
                if (!records[id]) {
                    records[id] = [];
                }
                var related = relateds[record[_this.relatedId]];
                records[id] = records[id].concat(related);
                return records;
            }, {});
        };
        /**
         * Create pivot records for the given records if needed.
         */
        MorphToMany.prototype.createPivots = function (parent, data, key) {
            var _this = this;
            Utils.forOwn(data[parent.entity], function (record) {
                var relatedIds = parent.query().newQuery(_this.pivot.entity)
                    .where(_this.id, record[_this.parentKey])
                    .where(_this.type, parent.entity)
                    .get()
                    .map(function (pivotRecord) { return pivotRecord[_this.parentKey]; });
                var relateds = (record[key] || []).filter(function (relatedId) { return !relatedIds.includes(relatedId); });
                if (!Array.isArray(relateds) || relateds.length === 0) {
                    return;
                }
                _this.createPivotRecord(parent, data, record, relateds);
            });
            return data;
        };
        /**
         * Create a pivot record.
         */
        MorphToMany.prototype.createPivotRecord = function (parent, data, record, related) {
            var _this = this;
            related.forEach(function (id) {
                var _a, _b;
                var parentId = record[_this.parentKey];
                var pivotKey = parentId + "_" + id + "_" + parent.entity;
                data[_this.pivot.entity] = __assign({}, data[_this.pivot.entity], (_a = {}, _a[pivotKey] = (_b = {
                        $id: pivotKey
                    },
                    _b[_this.relatedId] = id,
                    _b[_this.id] = parentId,
                    _b[_this.type] = parent.entity,
                    _b), _a));
            });
        };
        return MorphToMany;
    }(Relation));

    var MorphedByMany = /** @class */ (function (_super) {
        __extends(MorphedByMany, _super);
        /**
         * Create a new belongs to instance.
         */
        function MorphedByMany(model, related, pivot, relatedId, id, type, parentKey, relatedKey) {
            var _this = _super.call(this, model) /* istanbul ignore next */ || this;
            _this.related = _this.model.relation(related);
            _this.pivot = _this.model.relation(pivot);
            _this.relatedId = relatedId;
            _this.id = id;
            _this.type = type;
            _this.parentKey = parentKey;
            _this.relatedKey = relatedKey;
            return _this;
        }
        /**
         * Define the normalizr schema for the relationship.
         */
        MorphedByMany.prototype.define = function (schema) {
            return schema.many(this.related);
        };
        /**
         * Attach the relational key to the given data. Since morphed by many
         * relationship doesn't have any foreign key, it would do nothing.
         */
        MorphedByMany.prototype.attach = function (_key, _record, _data) {
            return;
        };
        /**
         * Make value to be set to model property. This method is used when
         * instantiating a model or creating a plain object from a model.
         */
        MorphedByMany.prototype.make = function (value, _parent, _key) {
            return this.makeManyRelation(value, this.related);
        };
        /**
         * Load the morph many relationship for the record.
         */
        MorphedByMany.prototype.load = function (query, collection, name, constraints) {
            var _this = this;
            var relatedQuery = this.getRelation(query, this.related.entity, constraints);
            var pivotQuery = query.newQuery(this.pivot.entity);
            this.addEagerConstraintForPivot(pivotQuery, collection, this.related.entity);
            var pivots = pivotQuery.get();
            this.addEagerConstraintForRelated(relatedQuery, pivots);
            var relateds = this.mapPivotRelations(pivots, relatedQuery);
            collection.forEach(function (item) {
                var related = relateds[item[_this.parentKey]];
                item[name] = related || [];
            });
        };
        /**
         * Set the constraints for the pivot relation.
         */
        MorphedByMany.prototype.addEagerConstraintForPivot = function (query, collection, type) {
            query.whereFk(this.type, type).whereFk(this.relatedId, this.getKeys(collection, this.parentKey));
        };
        /**
         * Set the constraints for the related relation.
         */
        MorphedByMany.prototype.addEagerConstraintForRelated = function (query, collection) {
            query.whereFk(this.relatedKey, this.getKeys(collection, this.id));
        };
        /**
         * Create a new indexed map for the pivot relation.
         */
        MorphedByMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
            var _this = this;
            var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
            return pivots.reduce(function (records, record) {
                var id = record[_this.relatedId];
                if (!records[id]) {
                    records[id] = [];
                }
                var related = relateds[record[_this.id]];
                records[id] = records[id].concat(related);
                return records;
            }, {});
        };
        /**
         * Create pivot records for the given records if needed.
         */
        MorphedByMany.prototype.createPivots = function (parent, data, key) {
            var _this = this;
            Utils.forOwn(data[parent.entity], function (record) {
                var related = record[key];
                if (!Array.isArray(related)) {
                    return;
                }
                _this.createPivotRecord(data, record, related);
            });
            return data;
        };
        /**
         * Create a pivot record.
         */
        MorphedByMany.prototype.createPivotRecord = function (data, record, related) {
            var _this = this;
            related.forEach(function (id) {
                var _a, _b;
                var parentId = record[_this.parentKey];
                var pivotKey = id + "_" + parentId + "_" + _this.related.entity;
                data[_this.pivot.entity] = __assign({}, data[_this.pivot.entity], (_a = {}, _a[pivotKey] = (_b = {
                        $id: pivotKey
                    },
                    _b[_this.relatedId] = parentId,
                    _b[_this.id] = id,
                    _b[_this.type] = _this.related.entity,
                    _b), _a));
            });
        };
        return MorphedByMany;
    }(Relation));

    var Serializer = /** @class */ (function () {
        function Serializer() {
        }
        /**
         * Serialize given model fields value to json.
         */
        Serializer.serialize = function (model) {
            var _this = this;
            var fields = model.$fields();
            return Object.keys(fields).reduce(function (record, key) {
                var value = model[key];
                record[key] = _this.serializeValue(value);
                return record;
            }, {});
        };
        /**
         * Serialize given value.
         */
        Serializer.serializeValue = function (value) {
            if (value instanceof Model) {
                return this.serializeItem(value);
            }
            if (Array.isArray(value)) {
                return this.serializeCollection(value);
            }
            return value;
        };
        /**
         * Serialize an item into json.
         */
        Serializer.serializeItem = function (item) {
            return item.$toJson();
        };
        /**
         * Serialize a collection into json.
         */
        Serializer.serializeCollection = function (collection) {
            return collection.map(function (item) {
                if (item instanceof Model) {
                    return item.$toJson();
                }
                return item;
            });
        };
        return Serializer;
    }());

    var Model = /** @class */ (function () {
        /**
         * Create a new model instance.
         */
        function Model(record) {
            /**
             * The ID value of the store index.
             */
            this.$id = null;
            this.$fill(record);
        }
        /**
         * The definition of the fields of the model and its relations.
         */
        Model.fields = function () {
            return {};
        };
        /**
         * Get the model schema definition by adding additional default fields.
         */
        Model.getFields = function () {
            if (this.cachedFields) {
                return this.cachedFields;
            }
            this.cachedFields = this.fields();
            return this.cachedFields;
        };
        /**
         * Create an attr attribute. The given value will be used as a default
         * value for the field.
         */
        Model.attr = function (value, mutator) {
            return new Attr(this, value, mutator);
        };
        /**
         * Create a string attribute.
         */
        Model.string = function (value, mutator) {
            return new String$1(this, value, mutator);
        };
        /**
         * Create a number attribute.
         */
        Model.number = function (value, mutator) {
            return new Number(this, value, mutator);
        };
        /**
         * Create a boolean attribute.
         */
        Model.boolean = function (value, mutator) {
            return new Boolean(this, value, mutator);
        };
        /**
         * Create an increment attribute. The field with this attribute will
         * automatically increment its value when creating a new record.
         */
        Model.increment = function () {
            return new Increment(this);
        };
        /**
         * Create a has one relationship.
         */
        Model.hasOne = function (related, foreignKey, localKey) {
            return new HasOne(this, related, foreignKey, this.localKey(localKey));
        };
        /**
         * Create a belongs to relationship.
         */
        Model.belongsTo = function (parent, foreignKey, ownerKey) {
            return new BelongsTo(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
        };
        /**
         * Create a has many relationship.
         */
        Model.hasMany = function (related, foreignKey, localKey) {
            return new HasMany(this, related, foreignKey, this.localKey(localKey));
        };
        /**
         * Create a has many by relationship.
         */
        Model.hasManyBy = function (parent, foreignKey, ownerKey) {
            return new HasManyBy(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
        };
        /**
         * Create a has many through relationship.
         */
        Model.hasManyThrough = function (related, through, firstKey, secondKey, localKey, secondLocalKey) {
            return new HasManyThrough(this, related, through, firstKey, secondKey, this.localKey(localKey), this.relation(through).localKey(secondLocalKey));
        };
        /**
         * The belongs to many relationship.
         */
        Model.belongsToMany = function (related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
            return new BelongsToMany(this, related, pivot, foreignPivotKey, relatedPivotKey, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
        };
        /**
         * Create a morph to relationship.
         */
        Model.morphTo = function (id, type) {
            return new MorphTo(this, id, type);
        };
        /**
         * Create a morph one relationship.
         */
        Model.morphOne = function (related, id, type, localKey) {
            return new MorphOne(this, related, id, type, this.localKey(localKey));
        };
        /**
         * Create a morph many relationship.
         */
        Model.morphMany = function (related, id, type, localKey) {
            return new MorphMany(this, related, id, type, this.localKey(localKey));
        };
        /**
         * Create a morph to many relationship.
         */
        Model.morphToMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
            return new MorphToMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
        };
        /**
         * Create a morphed by many relationship.
         */
        Model.morphedByMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
            return new MorphedByMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
        };
        /**
         * Mutators to mutate matching fields when instantiating the model.
         */
        Model.mutators = function () {
            return {};
        };
        /**
         * Get the database instance from the container.
         */
        Model.database = function () {
            return Container.database;
        };
        /**
         * Get the store instance from the container.
         */
        Model.store = function () {
            return this.database().store;
        };
        /**
         * Create a namespaced method name for Vuex Module from the given
         * method name.
         */
        Model.namespace = function (method) {
            return this.database().namespace + "/" + this.entity + "/" + method;
        };
        /**
         * Call Vuex Getters.
         */
        Model.getters = function (method) {
            return this.store().getters[this.namespace(method)];
        };
        /**
         * Dispatch Vuex Action.
         */
        Model.dispatch = function (method, payload) {
            return this.store().dispatch(this.namespace(method), payload);
        };
        /**
         * Commit Vuex Mutation.
         */
        Model.commit = function (callback) {
            this.store().commit(this.database().namespace + "/$mutate", {
                entity: this.entity,
                callback: callback
            });
        };
        /**
         * Get all records.
         */
        Model.all = function () {
            return this.getters('all')();
        };
        /**
         * Find a record.
         */
        Model.find = function (id) {
            return this.getters('find')(id);
        };
        /**
         * Get the record of the given array of ids.
         */
        Model.findIn = function (idList) {
            return this.getters('findIn')(idList);
        };
        /**
         * Get query instance.
         */
        Model.query = function () {
            return this.getters('query')();
        };
        /**
         * Create new data with all fields filled by default values.
         */
        Model.new = function () {
            return this.dispatch('new');
        };
        /**
         * Save given data to the store by replacing all existing records in the
         * store. If you want to save data without replacing existing records,
         * use the `insert` method instead.
         */
        Model.create = function (payload) {
            return this.dispatch('create', payload);
        };
        /**
         * Insert records.
         */
        Model.insert = function (payload) {
            return this.dispatch('insert', payload);
        };
        /**
         * Update records.
         */
        Model.update = function (payload) {
            return this.dispatch('update', payload);
        };
        /**
         * Insert or update records.
         */
        Model.insertOrUpdate = function (payload) {
            return this.dispatch('insertOrUpdate', payload);
        };
        /**
         * Delete records that matches the given condition.
         */
        Model.delete = function (payload) {
            return this.dispatch('delete', payload);
        };
        /**
         * Delete all records.
         */
        Model.deleteAll = function () {
            return this.dispatch('deleteAll');
        };
        /**
         * Get the value of the primary key.
         */
        Model.id = function (record) {
            var key = this.primaryKey;
            if (typeof key === 'string') {
                return record[key];
            }
            return key.map(function (k) { return record[k]; }).join('_');
        };
        /**
         * Get local key to pass to the attributes.
         */
        Model.localKey = function (key) {
            if (key) {
                return key;
            }
            return typeof this.primaryKey === 'string' ? this.primaryKey : 'id';
        };
        /**
         * Get a model from the container.
         */
        Model.relation = function (model) {
            if (typeof model !== 'string') {
                return model;
            }
            return this.database().model(model);
        };
        /**
         * Get the attribute class for the given attribute name.
         */
        Model.getAttributeClass = function (name) {
            switch (name) {
                case 'increment': return Increment;
                default:
                    throw Error("The attribute name \"" + name + "\" doesn't exist.");
            }
        };
        /**
         * Get all of the fields that matches the given attribute name.
         */
        Model.getFieldsByAttribute = function (name) {
            var attr = this.getAttributeClass(name);
            var fields = this.fields();
            return Object.keys(fields).reduce(function (newFields, key) {
                var field = fields[key];
                if (field instanceof attr) {
                    newFields[key] = field;
                }
                return newFields;
            }, {});
        };
        /**
         * Get all `increment` fields from the schema.
         */
        Model.getIncrementFields = function () {
            return this.getFieldsByAttribute('increment');
        };
        /**
         * Check if fields contains the `increment` field type.
         */
        Model.hasIncrementFields = function () {
            return Object.keys(this.getIncrementFields()).length > 0;
        };
        /**
         * Get all `belongsToMany` fields from the schema.
         */
        Model.pivotFields = function () {
            var fields = [];
            Utils.forOwn(this.fields(), function (field, key) {
                var _a;
                if (field instanceof BelongsToMany || field instanceof MorphToMany || field instanceof MorphedByMany) {
                    fields.push((_a = {}, _a[key] = field, _a));
                }
            });
            return fields;
        };
        /**
         * Check if fields contains the `belongsToMany` field type.
         */
        Model.hasPivotFields = function () {
            return this.pivotFields().length > 0;
        };
        /**
         * Fill any missing fields in the given record with the default value defined
         * in the model schema.
         */
        Model.hydrate = function (record) {
            return (new this(record)).$toJson();
        };
        /**
         * Get the constructor of this model.
         */
        Model.prototype.$self = function () {
            return this.constructor;
        };
        /**
         * The definition of the fields of the model and its relations.
         */
        Model.prototype.$fields = function () {
            return this.$self().getFields();
        };
        /**
         * Get the store instance from the container.
         */
        Model.prototype.$store = function () {
            return this.$self().store();
        };
        /**
         * Create a namespaced method name for Vuex Module from the given
         * method name.
         */
        Model.prototype.$namespace = function (method) {
            return this.$self().namespace(method);
        };
        /**
         * Call Vuex Getetrs.
         */
        Model.prototype.$getters = function (method) {
            return this.$self().getters(method);
        };
        /**
         * Dispatch Vuex Action.
         */
        Model.prototype.$dispatch = function (method, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.$self().dispatch(method, payload)];
                });
            });
        };
        /**
         * Get all records.
         */
        Model.prototype.$all = function () {
            return this.$getters('all')();
        };
        /**
         * Find a record.
         */
        Model.prototype.$find = function (id) {
            return this.$getters('find')(id);
        };
        /**
         * Find record of the given array of ids.
         */
        Model.prototype.$findIn = function (idList) {
            return this.$getters('findIn')(idList);
        };
        /**
         * Get query instance.
         */
        Model.prototype.$query = function () {
            return this.$getters('query')();
        };
        /**
         * Create records.
         */
        Model.prototype.$create = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.$dispatch('create', payload)];
                });
            });
        };
        /**
         * Create records.
         */
        Model.prototype.$insert = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.$dispatch('insert', payload)];
                });
            });
        };
        /**
         * Update records.
         */
        Model.prototype.$update = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (Array.isArray(payload)) {
                        return [2 /*return*/, this.$dispatch('update', payload)];
                    }
                    if (payload.where !== undefined) {
                        return [2 /*return*/, this.$dispatch('update', payload)];
                    }
                    if (this.$self().id(payload) === undefined) {
                        return [2 /*return*/, this.$dispatch('update', { where: this.$id, data: payload })];
                    }
                    return [2 /*return*/, this.$dispatch('update', payload)];
                });
            });
        };
        /**
         * Insert or update records.
         */
        Model.prototype.$insertOrUpdate = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.$dispatch('insertOrUpdate', payload)];
                });
            });
        };
        /**
         * Save record.
         */
        Model.prototype.$save = function () {
            return __awaiter(this, void 0, void 0, function () {
                var fields, record, records;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fields = this.$self().getFields();
                            record = Object.keys(fields).reduce(function (record, key) {
                                if (fields[key] instanceof Type) {
                                    record[key] = _this[key];
                                }
                                return record;
                            }, {});
                            return [4 /*yield*/, this.$dispatch('insertOrUpdate', { data: record })];
                        case 1:
                            records = _a.sent();
                            this.$fill(records[this.$self().entity][0]);
                            return [2 /*return*/, this];
                    }
                });
            });
        };
        /**
         * Delete records that matches the given condition.
         */
        Model.prototype.$delete = function (condition) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (condition) {
                        return [2 /*return*/, this.$dispatch('delete', condition)];
                    }
                    if (this.$id === null) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, this.$dispatch('delete', this.$id)];
                });
            });
        };
        /**
         * Delete all records.
         */
        Model.prototype.$deleteAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.$dispatch('deleteAll')];
                });
            });
        };
        /**
         * Fill the model instance with the given record. If no record were passed,
         * or if the record has any missing fields, each value of the fields will
         * be filled with its default value defined at model fields definition.
         */
        Model.prototype.$fill = function (record) {
            var _this = this;
            var data = record || {};
            var fields = this.$fields();
            Object.keys(fields).forEach(function (key) {
                var field = fields[key];
                var value = data[key];
                _this[key] = field.make(value, data, key);
            });
            if (data.$id !== undefined) {
                this.$id = data.$id;
            }
        };
        /**
         * Serialize field values into json.
         */
        Model.prototype.$toJson = function () {
            return Serializer.serialize(this);
        };
        /**
         * This method is used by Nuxt server-side rendering. It will prevent
         * `non-POJO` warning when using Vuex ORM with Nuxt universal mode.
         * The method is not meant to be used publicly by a user.
         *
         * See https://github.com/vuex-orm/vuex-orm/issues/255 for more detail.
         */
        Model.prototype.toJSON = function () {
            return this.$toJson();
        };
        /**
         * The primary key to be used for the model.
         */
        Model.primaryKey = 'id';
        /**
         * Vuex Store state definition.
         */
        Model.state = {};
        return Model;
    }());

    /**
     * Helpers to enable Immutable compatibility *without* bringing in
     * the 'immutable' package as a dependency.
     */

    /**
     * Check if an object is immutable by checking if it has a key specific
     * to the immutable library.
     *
     * @param  {any} object
     * @return {bool}
     */
    function isImmutable(object) {
      return !!(object && typeof object.hasOwnProperty === 'function' && (object.hasOwnProperty('__ownerID') || // Immutable.Map
      object._map && object._map.hasOwnProperty('__ownerID'))); // Immutable.Record
    }

    /**
     * Denormalize an immutable entity.
     *
     * @param  {Schema} schema
     * @param  {Immutable.Map|Immutable.Record} input
     * @param  {function} unvisit
     * @param  {function} getDenormalizedEntity
     * @return {Immutable.Map|Immutable.Record}
     */
    function denormalizeImmutable(schema, input, unvisit) {
      return Object.keys(schema).reduce(function (object, key) {
        // Immutable maps cast keys to strings on write so we need to ensure
        // we're accessing them using string keys.
        var stringKey = '' + key;

        if (object.has(stringKey)) {
          return object.set(stringKey, unvisit(object.get(stringKey), schema[stringKey]));
        } else {
          return object;
        }
      }, input);
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };











    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();







    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };



    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };











    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };

    var getDefaultGetId = function getDefaultGetId(idAttribute) {
      return function (input) {
        return isImmutable(input) ? input.get(idAttribute) : input[idAttribute];
      };
    };

    var EntitySchema = function () {
      function EntitySchema(key) {
        var definition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        classCallCheck(this, EntitySchema);

        if (!key || typeof key !== 'string') {
          throw new Error('Expected a string key for Entity, but found ' + key + '.');
        }

        var _options$idAttribute = options.idAttribute,
            idAttribute = _options$idAttribute === undefined ? 'id' : _options$idAttribute,
            _options$mergeStrateg = options.mergeStrategy,
            mergeStrategy = _options$mergeStrateg === undefined ? function (entityA, entityB) {
          return _extends({}, entityA, entityB);
        } : _options$mergeStrateg,
            _options$processStrat = options.processStrategy,
            processStrategy = _options$processStrat === undefined ? function (input) {
          return _extends({}, input);
        } : _options$processStrat;


        this._key = key;
        this._getId = typeof idAttribute === 'function' ? idAttribute : getDefaultGetId(idAttribute);
        this._idAttribute = idAttribute;
        this._mergeStrategy = mergeStrategy;
        this._processStrategy = processStrategy;
        this.define(definition);
      }

      EntitySchema.prototype.define = function define(definition) {
        this.schema = Object.keys(definition).reduce(function (entitySchema, key) {
          var _babelHelpers$extends;

          var schema = definition[key];
          return _extends({}, entitySchema, (_babelHelpers$extends = {}, _babelHelpers$extends[key] = schema, _babelHelpers$extends));
        }, this.schema || {});
      };

      EntitySchema.prototype.getId = function getId(input, parent, key) {
        return this._getId(input, parent, key);
      };

      EntitySchema.prototype.merge = function merge(entityA, entityB) {
        return this._mergeStrategy(entityA, entityB);
      };

      EntitySchema.prototype.normalize = function normalize(input, parent, key, visit, addEntity) {
        var _this = this;

        var processedEntity = this._processStrategy(input, parent, key);
        Object.keys(this.schema).forEach(function (key) {
          if (processedEntity.hasOwnProperty(key) && _typeof(processedEntity[key]) === 'object') {
            var schema = _this.schema[key];
            processedEntity[key] = visit(processedEntity[key], processedEntity, key, schema, addEntity);
          }
        });

        addEntity(this, processedEntity, input, parent, key);
        return this.getId(input, parent, key);
      };

      EntitySchema.prototype.denormalize = function denormalize(entity, unvisit) {
        var _this2 = this;

        if (isImmutable(entity)) {
          return denormalizeImmutable(this.schema, entity, unvisit);
        }

        Object.keys(this.schema).forEach(function (key) {
          if (entity.hasOwnProperty(key)) {
            var schema = _this2.schema[key];
            entity[key] = unvisit(entity[key], schema);
          }
        });
        return entity;
      };

      createClass(EntitySchema, [{
        key: 'key',
        get: function get$$1() {
          return this._key;
        }
      }, {
        key: 'idAttribute',
        get: function get$$1() {
          return this._idAttribute;
        }
      }]);
      return EntitySchema;
    }();

    var PolymorphicSchema = function () {
      function PolymorphicSchema(definition, schemaAttribute) {
        classCallCheck(this, PolymorphicSchema);

        if (schemaAttribute) {
          this._schemaAttribute = typeof schemaAttribute === 'string' ? function (input) {
            return input[schemaAttribute];
          } : schemaAttribute;
        }
        this.define(definition);
      }

      PolymorphicSchema.prototype.define = function define(definition) {
        this.schema = definition;
      };

      PolymorphicSchema.prototype.getSchemaAttribute = function getSchemaAttribute(input, parent, key) {
        return !this.isSingleSchema && this._schemaAttribute(input, parent, key);
      };

      PolymorphicSchema.prototype.inferSchema = function inferSchema(input, parent, key) {
        if (this.isSingleSchema) {
          return this.schema;
        }

        var attr = this.getSchemaAttribute(input, parent, key);
        return this.schema[attr];
      };

      PolymorphicSchema.prototype.normalizeValue = function normalizeValue(value, parent, key, visit, addEntity) {
        var schema = this.inferSchema(value, parent, key);
        if (!schema) {
          return value;
        }
        var normalizedValue = visit(value, parent, key, schema, addEntity);
        return this.isSingleSchema || normalizedValue === undefined || normalizedValue === null ? normalizedValue : { id: normalizedValue, schema: this.getSchemaAttribute(value, parent, key) };
      };

      PolymorphicSchema.prototype.denormalizeValue = function denormalizeValue(value, unvisit) {
        var schemaKey = isImmutable(value) ? value.get('schema') : value.schema;
        if (!this.isSingleSchema && !schemaKey) {
          return value;
        }
        var id = isImmutable(value) ? value.get('id') : value.id;
        var schema = this.isSingleSchema ? this.schema : this.schema[schemaKey];
        return unvisit(id || value, schema);
      };

      createClass(PolymorphicSchema, [{
        key: 'isSingleSchema',
        get: function get$$1() {
          return !this._schemaAttribute;
        }
      }]);
      return PolymorphicSchema;
    }();

    var UnionSchema = function (_PolymorphicSchema) {
      inherits(UnionSchema, _PolymorphicSchema);

      function UnionSchema(definition, schemaAttribute) {
        classCallCheck(this, UnionSchema);

        if (!schemaAttribute) {
          throw new Error('Expected option "schemaAttribute" not found on UnionSchema.');
        }
        return possibleConstructorReturn(this, _PolymorphicSchema.call(this, definition, schemaAttribute));
      }

      UnionSchema.prototype.normalize = function normalize(input, parent, key, visit, addEntity) {
        return this.normalizeValue(input, parent, key, visit, addEntity);
      };

      UnionSchema.prototype.denormalize = function denormalize(input, unvisit) {
        return this.denormalizeValue(input, unvisit);
      };

      return UnionSchema;
    }(PolymorphicSchema);

    var ValuesSchema = function (_PolymorphicSchema) {
      inherits(ValuesSchema, _PolymorphicSchema);

      function ValuesSchema() {
        classCallCheck(this, ValuesSchema);
        return possibleConstructorReturn(this, _PolymorphicSchema.apply(this, arguments));
      }

      ValuesSchema.prototype.normalize = function normalize(input, parent, key, visit, addEntity) {
        var _this2 = this;

        return Object.keys(input).reduce(function (output, key, index) {
          var _babelHelpers$extends;

          var value = input[key];
          return value !== undefined && value !== null ? _extends({}, output, (_babelHelpers$extends = {}, _babelHelpers$extends[key] = _this2.normalizeValue(value, input, key, visit, addEntity), _babelHelpers$extends)) : output;
        }, {});
      };

      ValuesSchema.prototype.denormalize = function denormalize(input, unvisit) {
        var _this3 = this;

        return Object.keys(input).reduce(function (output, key) {
          var _babelHelpers$extends2;

          var entityOrId = input[key];
          return _extends({}, output, (_babelHelpers$extends2 = {}, _babelHelpers$extends2[key] = _this3.denormalizeValue(entityOrId, unvisit), _babelHelpers$extends2));
        }, {});
      };

      return ValuesSchema;
    }(PolymorphicSchema);

    var validateSchema = function validateSchema(definition) {
      var isArray = Array.isArray(definition);
      if (isArray && definition.length > 1) {
        throw new Error('Expected schema definition to be a single schema, but found ' + definition.length + '.');
      }

      return definition[0];
    };

    var getValues = function getValues(input) {
      return Array.isArray(input) ? input : Object.keys(input).map(function (key) {
        return input[key];
      });
    };

    var normalize = function normalize(schema, input, parent, key, visit, addEntity) {
      schema = validateSchema(schema);

      var values = getValues(input);

      // Special case: Arrays pass *their* parent on to their children, since there
      // is not any special information that can be gathered from themselves directly
      return values.map(function (value, index) {
        return visit(value, parent, key, schema, addEntity);
      });
    };

    var ArraySchema = function (_PolymorphicSchema) {
      inherits(ArraySchema, _PolymorphicSchema);

      function ArraySchema() {
        classCallCheck(this, ArraySchema);
        return possibleConstructorReturn(this, _PolymorphicSchema.apply(this, arguments));
      }

      ArraySchema.prototype.normalize = function normalize(input, parent, key, visit, addEntity) {
        var _this2 = this;

        var values = getValues(input);

        return values.map(function (value, index) {
          return _this2.normalizeValue(value, parent, key, visit, addEntity);
        }).filter(function (value) {
          return value !== undefined && value !== null;
        });
      };

      ArraySchema.prototype.denormalize = function denormalize(input, unvisit) {
        var _this3 = this;

        return input && input.map ? input.map(function (value) {
          return _this3.denormalizeValue(value, unvisit);
        }) : input;
      };

      return ArraySchema;
    }(PolymorphicSchema);

    var _normalize = function _normalize(schema, input, parent, key, visit, addEntity) {
      var object = _extends({}, input);
      Object.keys(schema).forEach(function (key) {
        var localSchema = schema[key];
        var value = visit(input[key], input, key, localSchema, addEntity);
        if (value === undefined || value === null) {
          delete object[key];
        } else {
          object[key] = value;
        }
      });
      return object;
    };

    var _denormalize = function _denormalize(schema, input, unvisit) {
      if (isImmutable(input)) {
        return denormalizeImmutable(schema, input, unvisit);
      }

      var object = _extends({}, input);
      Object.keys(schema).forEach(function (key) {
        if (object[key]) {
          object[key] = unvisit(object[key], schema[key]);
        }
      });
      return object;
    };

    var ObjectSchema = function () {
      function ObjectSchema(definition) {
        classCallCheck(this, ObjectSchema);

        this.define(definition);
      }

      ObjectSchema.prototype.define = function define(definition) {
        this.schema = Object.keys(definition).reduce(function (entitySchema, key) {
          var _babelHelpers$extends;

          var schema = definition[key];
          return _extends({}, entitySchema, (_babelHelpers$extends = {}, _babelHelpers$extends[key] = schema, _babelHelpers$extends));
        }, this.schema || {});
      };

      ObjectSchema.prototype.normalize = function normalize() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _normalize.apply(undefined, [this.schema].concat(args));
      };

      ObjectSchema.prototype.denormalize = function denormalize() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return _denormalize.apply(undefined, [this.schema].concat(args));
      };

      return ObjectSchema;
    }();

    var visit = function visit(value, parent, key, schema, addEntity) {
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || !value) {
        return value;
      }

      if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) === 'object' && (!schema.normalize || typeof schema.normalize !== 'function')) {
        var method = Array.isArray(schema) ? normalize : _normalize;
        return method(schema, value, parent, key, visit, addEntity);
      }

      return schema.normalize(value, parent, key, visit, addEntity);
    };

    var addEntities = function addEntities(entities) {
      return function (schema, processedEntity, value, parent, key) {
        var schemaKey = schema.key;
        var id = schema.getId(value, parent, key);
        if (!(schemaKey in entities)) {
          entities[schemaKey] = {};
        }

        var existingEntity = entities[schemaKey][id];
        if (existingEntity) {
          entities[schemaKey][id] = schema.merge(existingEntity, processedEntity);
        } else {
          entities[schemaKey][id] = processedEntity;
        }
      };
    };

    var schema = {
      Array: ArraySchema,
      Entity: EntitySchema,
      Object: ObjectSchema,
      Union: UnionSchema,
      Values: ValuesSchema
    };

    var normalize$1 = function normalize$$1(input, schema) {
      if (!input || (typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object') {
        throw new Error('Unexpected input given to normalize. Expected type to be "object", found "' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)) + '".');
      }

      var entities = {};
      var addEntity = addEntities(entities);

      var result = visit(input, input, null, schema, addEntity);
      return { entities: entities, result: result };
    };

    var Normalizer = /** @class */ (function () {
        function Normalizer() {
        }
        /**
         * Normalize the data given data.
         */
        Normalizer.process = function (query, record) {
            if (Utils.isEmpty(record)) {
                return {};
            }
            var entity = query.database().schemas[query.model.entity];
            var schema = Array.isArray(record) ? [entity] : entity;
            return normalize$1(record, schema).entities;
        };
        return Normalizer;
    }());

    var PivotCreator = /** @class */ (function () {
        function PivotCreator() {
        }
        /**
         * Create an intermediate entity if the data contains any entities that
         * require it for example `belongsTo` or `morphMany`.
         */
        PivotCreator.process = function (query, data) {
            Object.keys(data).forEach(function (entity) {
                var model = query.getModel(entity);
                if (model.hasPivotFields()) {
                    Utils.forOwn(model.pivotFields(), function (field) {
                        Utils.forOwn(field, function (attr, key) { attr.createPivots(model, data, key); });
                    });
                }
            });
            return data;
        };
        return PivotCreator;
    }());

    var Incrementer = /** @class */ (function () {
        function Incrementer() {
        }
        /**
         * Increment all fields that have increment attribute.
         */
        Incrementer.process = function (query, data) {
            var _this = this;
            return Utils.mapValues(data, function (records, entity) {
                var newQuery = query.newQuery(entity);
                // If the entity doesn't have increment attribute, do nothing and
                // just return immediately.
                if (!newQuery.model.hasIncrementFields()) {
                    return records;
                }
                _this.processRecordsByFields(records, newQuery);
                return records;
            });
        };
        /**
         * Process all of the increment fields.
         */
        Incrementer.processRecordsByFields = function (records, query) {
            var _this = this;
            var fields = query.model.getIncrementFields();
            Utils.forOwn(fields, function (_attr, key) {
                _this.processRecords(records, query, key);
            });
        };
        /**
         * Process all records and increment all field that is defined as increment.
         */
        Incrementer.processRecords = function (records, query, key) {
            var max = this.max(records, query, key);
            Utils.forOwn(records, function (record) {
                if (typeof record[key] !== 'number') {
                    record[key] = ++max;
                }
            });
        };
        /**
         * Get the max value of the specified field with given data combined
         * with existing records.
         */
        Incrementer.max = function (records, query, field) {
            var maxInState = query.max(field);
            var maxInRecord = Math.max.apply(Math, Utils.map(records, function (record) {
                var id = record[field];
                return typeof id === 'number' ? id : 0;
            }));
            return Math.max(maxInRecord, maxInState);
        };
        return Incrementer;
    }());

    var Attacher = /** @class */ (function () {
        function Attacher() {
        }
        /**
         * Attach missing relational key to the records.
         */
        Attacher.process = function (query, data) {
            Utils.forOwn(data, function (entity, name) {
                var fields = query.getModel(name).fields();
                Utils.forOwn(entity, function (record) {
                    Utils.forOwn(record, function (value, key) {
                        var field = fields[key];
                        if (field instanceof Relation) {
                            field.attach(value, record, data);
                        }
                    });
                });
            });
            return data;
        };
        return Attacher;
    }());

    var IdFixer = /** @class */ (function () {
        function IdFixer() {
        }
        /**
         * Fix all of the "no key" records with appropriate id value if it can.
         */
        IdFixer.process = function (query, data) {
            var _this = this;
            return Utils.mapValues(data, function (records, entity) {
                var newQuery = query.newQuery(entity);
                return _this.processRecords(records, newQuery);
            });
        };
        /**
         * Process records to Fix all of the "no key" records with
         * appropriate id value if it can.
         */
        IdFixer.processRecords = function (records, query) {
            return Object.keys(records).reduce(function (newRecords, id) {
                var record = records[id];
                var newId = query.model.id(record);
                var newStringId = isNaN(newId) ? newId : newId.toString();
                if (newId === undefined || id === newStringId) {
                    newRecords[id] = record;
                    return newRecords;
                }
                newRecords[newStringId] = __assign({}, record, { $id: newId });
                return newRecords;
            }, {});
        };
        return IdFixer;
    }());

    var Processor = /** @class */ (function () {
        function Processor() {
        }
        /**
         * Normalize the given data.
         */
        Processor.normalize = function (query, record) {
            var data = Normalizer.process(query, record);
            data = PivotCreator.process(query, data);
            data = Incrementer.process(query, data);
            data = Attacher.process(query, data);
            data = IdFixer.process(query, data);
            return data;
        };
        return Processor;
    }());

    var WhereFilter = /** @class */ (function () {
        function WhereFilter() {
        }
        /**
         * Filter the given data by registered where clause.
         */
        WhereFilter.filter = function (query, records) {
            var _this = this;
            if (query.wheres.length === 0) {
                return records;
            }
            return records.filter(function (record) { return _this.check(query, record); });
        };
        /**
         * Checks if given Record matches the registered where clause.
         */
        WhereFilter.check = function (query, record) {
            var whereTypes = Utils.groupBy(query.wheres, function (where) { return where.boolean; });
            var comparator = this.getComparator(query, record);
            var results = [];
            whereTypes.and && results.push(whereTypes.and.every(comparator));
            whereTypes.or && results.push(whereTypes.or.some(comparator));
            return results.indexOf(true) !== -1;
        };
        /**
         * Get comparator for the where clause.
         */
        WhereFilter.getComparator = function (query, record) {
            var _this = this;
            return function (where) {
                // Function with Record and Query as argument.
                if (typeof where.field === 'function') {
                    var newQuery = new Query(query.rootState, query.entity);
                    var result = _this.executeWhereClosure(newQuery, record, where.field);
                    if (typeof result === 'boolean') {
                        return result;
                    }
                    // If closure returns undefined, we need to execute the local query
                    var matchingRecords = newQuery.get();
                    // And check if current record is part of the resul
                    return !Utils.isEmpty(matchingRecords.filter(function (rec) {
                        return rec['$id'] === record['$id'];
                    }));
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
        WhereFilter.executeWhereClosure = function (query, record, closure) {
            if (closure.length !== 3) {
                return closure(record, query);
            }
            var model = new query.model(record);
            return closure(record, query, model);
        };
        return WhereFilter;
    }());

    var OrderByFilter = /** @class */ (function () {
        function OrderByFilter() {
        }
        /**
         * Sort the given data by registered orders.
         */
        OrderByFilter.filter = function (query, records) {
            if (query.orders.length === 0) {
                return records;
            }
            var keys = query.orders.map(function (order) { return order.field; });
            var directions = query.orders.map(function (order) { return order.direction; });
            return Utils.orderBy(records, keys, directions);
        };
        return OrderByFilter;
    }());

    var LimitFilter = /** @class */ (function () {
        function LimitFilter() {
        }
        /**
         * Limit the given records by the lmilt and offset.
         */
        LimitFilter.filter = function (query, records) {
            return records.slice(query.offsetNumber, query.offsetNumber + query.limitNumber);
        };
        return LimitFilter;
    }());

    var Filter = /** @class */ (function () {
        function Filter() {
        }
        /**
         * Filter the given data by registered where clause.
         */
        Filter.where = function (query, records) {
            return WhereFilter.filter(query, records);
        };
        /**
         * Sort the given data by registered orders.
         */
        Filter.orderBy = function (query, records) {
            return OrderByFilter.filter(query, records);
        };
        /**
         * Limit the given records by the lmilt and offset.
         */
        Filter.limit = function (query, records) {
            return LimitFilter.filter(query, records);
        };
        return Filter;
    }());

    var Loader = /** @class */ (function () {
        function Loader() {
        }
        /**
         * Set the relationships that should be eager loaded with the query.
         */
        Loader.with = function (query, name, constraint) {
            // If the name of the relation is `*`, we'll load all relationships.
            if (name === '*') {
                this.withAll(query);
                return;
            }
            // Else parse relations and set appropriate constraints.
            this.parseWithRelations(query, name.split('.'), constraint);
        };
        /**
         * Set all relationships to be eager loaded with the query.
         */
        Loader.withAll = function (query, constraint) {
            if (constraint === void 0) { constraint = function () { return null; }; }
            var fields = query.model.getFields();
            for (var field in fields) {
                fields[field] instanceof Relation && this.with(query, field, constraint);
            }
        };
        /**
         * Set relationships to be recursively eager loaded with the query.
         */
        Loader.withAllRecursive = function (query, depth) {
            this.withAll(query, function (relatedQuery) {
                depth > 0 && relatedQuery.withAllRecursive(depth - 1);
            });
        };
        /**
         * Set eager load relation and constraint.
         */
        Loader.setEagerLoad = function (query, name, constraint) {
            if (constraint === void 0) { constraint = null; }
            if (!query.load[name]) {
                query.load[name] = [];
            }
            constraint && query.load[name].push(constraint);
        };
        /**
         * Parse a list of relations into individuals.
         */
        Loader.parseWithRelations = function (query, relations, constraint) {
            var _this = this;
            // First we'll get the very first relationship from teh whole relations.
            var relation = relations[0];
            // If the first relation has "or" syntax which is `|` for example
            // `posts|videos`, set each of them as separate eager load.
            relation.split('|').forEach(function (name) {
                // If there's only one relationship in relations array, that means
                // there's no nested relationship. So we'll set the given
                // constraint to the relationship loading.
                if (relations.length === 1) {
                    _this.setEagerLoad(query, name, constraint);
                    return;
                }
                // Else we'll skip adding constraint because the constraint has to be
                // applied to the nested relationship. We'll let `addNestedWiths`
                // method to handle that later.
                _this.setEagerLoad(query, name);
            });
            // If the given relations only contains a single name, which means it
            // doesn't have any nested relations such as `posts.comments`, we
            // don't need go farther so return here.
            if (relations.length === 1) {
                return;
            }
            // Finally, we shift the first relation from the array and handle lest
            // of relations as a nested relation.
            relations.shift();
            this.addNestedWiths(query, relation, relations, constraint);
        };
        /**
         * Parse the nested relationships in a relation.
         */
        Loader.addNestedWiths = function (query, name, children, constraint) {
            this.setEagerLoad(query, name, function (nestedQuery) {
                nestedQuery.with(children.join('.'), constraint);
            });
        };
        /**
         * Eager load the relationships for the given collection.
         */
        Loader.eagerLoadRelations = function (query, collection) {
            var fields = query.model.getFields();
            for (var name_1 in query.load) {
                var constraints = query.load[name_1];
                var relation = fields[name_1];
                if (relation instanceof Relation) {
                    relation.load(query, collection, name_1, constraints);
                }
            }
        };
        return Loader;
    }());

    var Rollcaller = /** @class */ (function () {
        function Rollcaller() {
        }
        /**
         * Set where constraint based on relationship existence.
         */
        Rollcaller.has = function (query, relation, operator, count) {
            this.setHas(query, relation, 'exists', operator, count);
        };
        /**
         * Set where constraint based on relationship absence.
         */
        Rollcaller.hasNot = function (query, relation, operator, count) {
            this.setHas(query, relation, 'doesntExist', operator, count);
        };
        /**
         * Add where has condition.
         */
        Rollcaller.whereHas = function (query, relation, constraint) {
            this.setHas(query, relation, 'exists', undefined, undefined, constraint);
        };
        /**
         * Add where has not condition.
         */
        Rollcaller.whereHasNot = function (query, relation, constraint) {
            this.setHas(query, relation, 'doesntExist', undefined, undefined, constraint);
        };
        /**
         * Set `has` condition.
         */
        Rollcaller.setHas = function (query, relation, type, operator, count, constraint) {
            if (operator === void 0) { operator = '>='; }
            if (count === void 0) { count = 1; }
            if (constraint === void 0) { constraint = null; }
            if (typeof operator === 'number') {
                query.have.push({ relation: relation, type: type, operator: '>=', count: operator, constraint: constraint });
                return;
            }
            query.have.push({ relation: relation, type: type, operator: operator, count: count, constraint: constraint });
        };
        /**
         * Convert `has` conditions to where clause. It will check any relationship
         * existence, or absence for the records then set ids of the records that
         * matched the condition to `where` clause.
         *
         * This way, when the query gets executed, only those records that matched
         * the `has` condition get retrieved. In the future, once relationship index
         * mapping is implemented, we can simply do all checks inside the where
         * filter since we can treat `has` condition as usual `where` condition.
         *
         * For now, since we must fetch any relationship by eager loading them, due
         * to performance concern, we'll apply `has` conditions this way to gain
         * maximum performance.
         */
        Rollcaller.applyConstraints = function (query) {
            if (query.have.length === 0) {
                return;
            }
            var newQuery = query.newQuery();
            this.addHasWhereConstraints(query, newQuery);
            this.addHasConstraints(query, newQuery.get());
        };
        /**
         * Add has constraints to the given query. It's going to set all relationship
         * as `with` alongside with its closure constraints.
         */
        Rollcaller.addHasWhereConstraints = function (query, newQuery) {
            query.have.forEach(function (constraint) {
                newQuery.with(constraint.relation, constraint.constraint);
            });
        };
        /**
         * Add has constraints as where clause.
         */
        Rollcaller.addHasConstraints = function (query, collection) {
            var comparators = this.getComparators(query);
            var ids = [];
            collection.forEach(function (model) {
                if (comparators.every(function (comparator) { return comparator(model); })) {
                    ids.push(model.$id);
                }
            });
            query.whereIdIn(ids);
        };
        /**
         * Get comparators for the has clause.
         */
        Rollcaller.getComparators = function (query) {
            var _this = this;
            return query.have.map(function (constraint) { return _this.getComparator(constraint); });
        };
        /**
         * Get a comparator for the has clause.
         */
        Rollcaller.getComparator = function (constraint) {
            var _this = this;
            var compare = this.getCountComparator(constraint.operator);
            return function (model) {
                var count = _this.getRelationshipCount(model[constraint.relation]);
                var result = compare(count, constraint.count);
                return constraint.type === 'exists' ? result : !result;
            };
        };
        /**
         * Get count of the relationship.
         */
        Rollcaller.getRelationshipCount = function (relation) {
            if (Array.isArray(relation)) {
                return relation.length;
            }
            return relation ? 1 : 0;
        };
        /**
         * Get comparator function for the `has` clause.
         */
        Rollcaller.getCountComparator = function (operator) {
            switch (operator) {
                case '=':
                    return function (x, y) { return x === y; };
                case '>':
                    return function (x, y) { return x > y; };
                case '>=':
                    return function (x, y) { return x >= y; };
                case '<':
                    return function (x, y) { return x > 0 && x < y; };
                case '<=':
                    return function (x, y) { return x > 0 && x <= y; };
                default:
                    return function (x, y) { return x === y; };
            }
        };
        return Rollcaller;
    }());

    var Hook = /** @class */ (function () {
        /**
         * Create a lidecycle hook instance.
         */
        function Hook(query) {
            /**
             * The global hook index to be deleted.
             */
            this.indexToBeDeleted = [];
            this.query = query;
        }
        /**
         * Register a callback. It Returns unique ID for registered callback.
         */
        Hook.on = function (on, callback, once) {
            if (once === void 0) { once = false; }
            var uid = this.lastHookId + 1;
            this.lastHookId = uid;
            if (!this.hooks[on]) {
                this.hooks[on] = [];
            }
            this.hooks[on].push({ callback: callback, once: once, uid: uid });
            return uid;
        };
        /**
         * Remove hook registration.
         */
        Hook.off = function (uid) {
            var _this = this;
            var removed = false;
            Object.keys(this.hooks).some(function (on) {
                var hook = _this.hooks[on];
                var index = hook.findIndex(function (h) { return h.uid === uid; });
                if (index !== -1) {
                    hook.splice(index, 1);
                    removed = true;
                }
                return removed;
            });
            return removed;
        };
        /**
         * Get the hook class.
         */
        Hook.prototype.self = function () {
            return this.constructor;
        };
        /**
         * Get the hook for the given name.
         */
        Hook.prototype.getHook = function (name) {
            var hook = this.query.model[name];
            return hook || null;
        };
        /**
         * Get the global hook.
         */
        Hook.prototype.getGlobalHook = function (name) {
            var hook = this.self().hooks[name];
            return hook || null;
        };
        /**
         * Check if the given hook exist.
         */
        Hook.prototype.has = function (name) {
            return !!this.getHook(name) || !!this.getGlobalHook(name);
        };
        /**
         * Execute select hook for the given collection.
         */
        Hook.prototype.executeSelectHook = function (on, records) {
            if (!this.has(on)) {
                return records;
            }
            records = this.executeLocalSelectHook(on, records);
            records = this.executeGlobalSelectHook(on, records);
            return records;
        };
        /**
         * Execute select hook against given records.
         */
        Hook.prototype.executeLocalSelectHook = function (on, records) {
            var hook = this.getHook(on);
            if (!hook) {
                return records;
            }
            return hook(records, this.query.entity);
        };
        /**
         * Execute the global select hook against given records.
         */
        Hook.prototype.executeGlobalSelectHook = function (on, records) {
            var _this = this;
            var hooks = this.getGlobalHook(on);
            if (!hooks) {
                return records;
            }
            // Track indexes to delete.
            var deleteHookIndexes = [];
            // Loop all hooks.
            hooks.forEach(function (hook, hookIndex) {
                var callback = hook.callback, once = hook.once;
                records = callback.call(_this.query, records, _this.query.entity);
                // Add hook index to delete.
                once && deleteHookIndexes.push(hookIndex);
            });
            // Remove hooks to be deleted in reverse order.
            deleteHookIndexes.reverse().forEach(function (hookIndex) {
                hooks.splice(hookIndex, 1);
            });
            return records;
        };
        /**
         * Execute the callback for all given records.
         */
        Hook.prototype.executeMutationHookOnRecords = function (on, records) {
            var _this = this;
            if (!this.has(on)) {
                return;
            }
            Object.keys(records).forEach(function (id) {
                var result = _this.executeMutationHook(on, records[id]);
                if (result === false) {
                    delete records[id];
                }
            });
            this.removeGlobalHook(on);
        };
        /**
         * Execute mutation hook against given model.
         */
        Hook.prototype.executeMutationHook = function (on, model) {
            if (this.executeLocalMutationHook(on, model) === false) {
                return false;
            }
            if (this.executeGlobalMutationHook(on, model) === false) {
                return false;
            }
        };
        /**
         * Execute the local mutation hook.
         */
        Hook.prototype.executeLocalMutationHook = function (on, model) {
            var hook = this.getHook(on);
            if (!hook) {
                return;
            }
            return hook(model, this.query.entity);
        };
        /**
         * Execute the global mutation hook.
         */
        Hook.prototype.executeGlobalMutationHook = function (on, model) {
            var _this = this;
            var hooks = this.getGlobalHook(on);
            if (!hooks) {
                return;
            }
            // Track results.
            var results = [];
            // Loop all hooks.
            hooks.forEach(function (hook, index) {
                results.push(hook.callback.call(_this.query, model, _this.query.entity));
                // Add hook index to delete.
                hook.once && _this.indexToBeDeleted.push(index);
            });
            if (results.includes(false)) {
                return false;
            }
        };
        /**
         * Remove global hooks which are executed and defined as once.
         */
        Hook.prototype.removeGlobalHook = function (on) {
            var hooks = this.getGlobalHook(on);
            if (!hooks) {
                return;
            }
            this.indexToBeDeleted.reverse().forEach(function (index) { hooks.splice(index, 1); });
        };
        /**
         * Global lifecycle hooks for the query.
         */
        Hook.hooks = {};
        /**
         * Hook UID counter.
         */
        Hook.lastHookId = 0;
        return Hook;
    }());

    var Query = /** @class */ (function () {
        /**
         * Create a new Query instance.
         */
        function Query(state, entity) {
            /**
             * Primary key ids to filter records by. It is used for filtering records
             * direct key lookup when a user is trying to fetch records by its
             * primary key.
             *
             * It should not be used if there is a logic which prevents index usage, for
             * example, an "or" condition which already requires a full scan of records.
             */
            this.idFilter = null;
            /**
             * Whether to use `idFilter` key lookup. True if there is a logic which
             * prevents index usage, for example, an "or" condition which already
             * requires full scan.
             */
            this.cancelIdFilter = false;
            /**
             * Primary key ids to filter joined records. It is used for filtering
             * records direct key lookup. It should not be cancelled, because it
             * is free from the effects of normal where methods.
             */
            this.joinedIdFilter = null;
            /**
             * The where constraints for the query.
             */
            this.wheres = [];
            /**
             * The has constraints for the query.
             */
            this.have = [];
            /**
             * The orders of the query result.
             */
            this.orders = [];
            /**
             * Number of results to skip.
             */
            this.offsetNumber = 0;
            /**
             * Maximum number of records to return.
             *
             * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
             */
            this.limitNumber = Math.pow(2, 53) - 1;
            /**
             * The relationships that should be eager loaded with the result.
             */
            this.load = {};
            this.rootState = state;
            this.state = state[entity];
            this.entity = entity;
            this.model = this.getModel(entity);
            this.module = this.getModule(entity);
            this.hook = new Hook(this);
        }
        /**
         * Get the database from the container.
         */
        Query.database = function () {
            return Container.database;
        };
        /**
         * Get model of given name from the container.
         */
        Query.getModel = function (name) {
            return this.database().model(name);
        };
        /**
         * Get all models from the container.
         */
        Query.getModels = function () {
            return this.database().models();
        };
        /**
         * Get module of given name from the container.
         */
        Query.getModule = function (name) {
            return this.database().module(name);
        };
        /**
         * Get all modules from the container.
         */
        Query.getModules = function () {
            return this.database().modules();
        };
        /**
         * Delete all records from the state.
         */
        Query.deleteAll = function (state) {
            var _this = this;
            var models = this.getModels();
            Utils.forOwn(models, function (_model, name) {
                state[name] && (new _this(state, name)).deleteAll();
            });
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
            entity = entity || this.entity;
            return (new Query(this.rootState, entity));
        };
        /**
         * Get the database from the container.
         */
        Query.prototype.database = function () {
            return this.self().database();
        };
        /**
         * Get model of given name from the container.
         */
        Query.prototype.getModel = function (name) {
            var entity = name || this.entity;
            return this.self().getModel(entity);
        };
        /**
         * Get all models from the container.
         */
        Query.prototype.getModels = function () {
            return this.self().getModels();
        };
        /**
         * Get module of given name from the container.
         */
        Query.prototype.getModule = function (name) {
            var entity = name || this.entity;
            return this.self().getModule(entity);
        };
        /**
         * Get all modules from the container.
         */
        Query.prototype.getModules = function () {
            return this.self().getModules();
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
            return this.item(this.state.data[id]); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Get the record of the given array of ids.
         */
        Query.prototype.findIn = function (idList) {
            var _this = this;
            return idList.map(function (id) { return _this.state.data[id]; }).filter(function (item) { return item; }); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Returns all record of the query chain result.
         */
        Query.prototype.get = function () {
            var records = this.select();
            return this.collect(records); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Returns the first record of the query chain result.
         */
        Query.prototype.first = function () {
            var records = this.select();
            return this.item(records[0]); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Returns the last single record of the query chain result.
         */
        Query.prototype.last = function () {
            var records = this.select();
            return this.item(records[records.length - 1]); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Add a and where clause to the query.
         */
        Query.prototype.where = function (field, value) {
            if (this.isIdfilterable(field)) {
                this.setIdFilter(value);
            }
            this.wheres.push({ field: field, value: value, boolean: 'and' });
            return this;
        };
        /**
         * Add a or where clause to the query.
         */
        Query.prototype.orWhere = function (field, value) {
            // Cacncel id filter usage, since "or" needs full scan.
            this.cancelIdFilter = true;
            this.wheres.push({ field: field, value: value, boolean: 'or' });
            return this;
        };
        /**
         * Filter records by their primary key.
         */
        Query.prototype.whereId = function (value) {
            return this.where(this.model.primaryKey, value);
        };
        /**
         * Filter records by their primary keys.
         */
        Query.prototype.whereIdIn = function (values) {
            return this.where(this.model.primaryKey, values);
        };
        /**
         * Fast comparison for foreign keys. If the foreign key is the primary key,
         * it uses object lookup, fallback normal where otherwise.
         *
         * Why separate `whereFk` instead of just `where`? Additional logic needed
         * for the distinction between where and orWhere in normal queries, but
         * Fk lookups are always "and" type.
         */
        Query.prototype.whereFk = function (field, value) {
            var values = Array.isArray(value) ? value : [value];
            // If lookup filed is the primary key. Initialize or get intersection,
            // because boolean and could have a condition such as
            // `whereId(1).whereId(2).get()`.
            if (field === this.model.primaryKey) {
                this.setJoinedIdFilter(values);
                return this;
            }
            // Else fallback to normal where.
            this.where(field, values);
            return this;
        };
        /**
         * Check whether the given field and value combination is filterable through
         * primary key direct look up.
         */
        Query.prototype.isIdfilterable = function (field) {
            return field === this.model.primaryKey && !this.cancelIdFilter;
        };
        /**
         * Set id filter for the given where condition.
         */
        Query.prototype.setIdFilter = function (value) {
            var _this = this;
            var values = Array.isArray(value) ? value : [value];
            // Initialize or get intersection, because boolean and could have a
            // condition such as `whereIdIn([1,2,3]).whereIdIn([1,2]).get()`.
            if (this.idFilter === null) {
                this.idFilter = new Set(values);
                return;
            }
            this.idFilter = new Set(values.filter(function (v) { return _this.idFilter.has(v); }));
        };
        /**
         * Set joined id filter for the given where condition.
         */
        Query.prototype.setJoinedIdFilter = function (values) {
            var _this = this;
            // Initialize or get intersection, because boolean and could have a
            // condition such as `whereId(1).whereId(2).get()`.
            if (this.joinedIdFilter === null) {
                this.joinedIdFilter = new Set(values);
                return;
            }
            this.joinedIdFilter = new Set(values.filter(function (v) { return _this.joinedIdFilter.has(v); }));
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
            this.offsetNumber = offset;
            return this;
        };
        /**
         * Add limit to the query.
         */
        Query.prototype.limit = function (limit) {
            this.limitNumber = limit;
            return this;
        };
        /**
         * Set the relationships that should be loaded.
         */
        Query.prototype.with = function (name, constraint) {
            if (constraint === void 0) { constraint = null; }
            Loader.with(this, name, constraint);
            return this;
        };
        /**
         * Query all relations.
         */
        Query.prototype.withAll = function () {
            Loader.withAll(this);
            return this;
        };
        /**
         * Query all relations recursively.
         */
        Query.prototype.withAllRecursive = function (depth) {
            if (depth === void 0) { depth = 3; }
            Loader.withAllRecursive(this, depth);
            return this;
        };
        /**
         * Set where constraint based on relationship existence.
         */
        Query.prototype.has = function (relation, operator, count) {
            Rollcaller.has(this, relation, operator, count);
            return this;
        };
        /**
         * Set where constraint based on relationship absence.
         */
        Query.prototype.hasNot = function (relation, operator, count) {
            Rollcaller.hasNot(this, relation, operator, count);
            return this;
        };
        /**
         * Add where has condition.
         */
        Query.prototype.whereHas = function (relation, constraint) {
            Rollcaller.whereHas(this, relation, constraint);
            return this;
        };
        /**
         * Add where has not condition.
         */
        Query.prototype.whereHasNot = function (relation, constraint) {
            Rollcaller.whereHasNot(this, relation, constraint);
            return this;
        };
        /**
         * Get all records from the state and convert them into the array. It will
         * check if the record is an instance of Model and if not, it will
         * instantiate before returning them.
         *
         * This is needed to support SSR, that when the state is hydrated at server
         * side, it will be converted to the plain record at the client side.
         */
        Query.prototype.records = function () {
            var _this = this;
            this.finalizeIdFilter();
            return this.getIdsToLookup().map(function (id) {
                var model = _this.state.data[id];
                return model instanceof Model ? model : _this.hydrate(model);
            });
        };
        /**
         * Check whether if id filters should on select. If not, clear out id filter.
         */
        Query.prototype.finalizeIdFilter = function () {
            if (!this.cancelIdFilter || this.idFilter === null) {
                return;
            }
            this.where(this.model.primaryKey, Array.from(this.idFilter.values()));
            this.idFilter = null;
        };
        /**
         * Get a list of id that should be used to lookup when fetching records
         * from the state.
         */
        Query.prototype.getIdsToLookup = function () {
            var _this = this;
            // If both id filter and joined id filter are set, intersect them.
            if (this.idFilter && this.joinedIdFilter) {
                return Array.from(this.idFilter.values()).filter(function (id) {
                    return _this.joinedIdFilter.has(id);
                });
            }
            // If only either one is set, return which one is set.
            if (this.idFilter || this.joinedIdFilter) {
                return Array.from((this.idFilter || this.joinedIdFilter).values());
            }
            // If none is set, return all keys.
            return Object.keys(this.state.data);
        };
        /**
         * Process the query and filter data.
         */
        Query.prototype.select = function () {
            // At first, well apply any `has` condition to the query.
            Rollcaller.applyConstraints(this);
            // Next, get all record as an array and then start filtering it through.
            var records = this.records();
            // Process `beforeProcess` hook.
            records = this.hook.executeSelectHook('beforeSelect', records);
            // Let's filter the records at first by the where clauses.
            records = this.filterWhere(records);
            // Process `afterWhere` hook.
            records = this.hook.executeSelectHook('afterWhere', records);
            // Next, lets sort the data.
            records = this.filterOrderBy(records);
            // Process `afterOrderBy` hook.
            records = this.hook.executeSelectHook('afterOrderBy', records);
            // Finally, slice the record by limit and offset.
            records = this.filterLimit(records);
            // Process `afterLimit` hook.
            records = this.hook.executeSelectHook('afterLimit', records);
            return records; // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Filter the given data by registered where clause.
         */
        Query.prototype.filterWhere = function (records) {
            return Filter.where(this, records);
        };
        /**
         * Sort the given data by registered orders.
         */
        Query.prototype.filterOrderBy = function (records) {
            return Filter.orderBy(this, records);
        };
        /**
         * Limit the given records by the lmilt and offset.
         */
        Query.prototype.filterLimit = function (records) {
            return Filter.limit(this, records);
        };
        /**
         * Get the count of the retrieved data.
         */
        Query.prototype.count = function () {
            return this.get().length;
        };
        /**
         * Get the max value of the specified filed.
         */
        Query.prototype.max = function (field) {
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
            var numbers = this.get().reduce(function (numbers, item) {
                if (typeof item[field] === 'number') {
                    numbers.push(item[field]);
                }
                return numbers;
            }, []);
            return numbers.length === 0 ? 0 : Math.min.apply(Math, numbers);
        };
        /**
         * Get the sum value of the specified filed.
         */
        Query.prototype.sum = function (field) {
            return this.get().reduce(function (sum, item) {
                if (typeof item[field] === 'number') {
                    sum += item[field];
                }
                return sum;
            }, 0);
        };
        /**
         * Create a item from given record.
         */
        Query.prototype.item = function (item) {
            if (!item) {
                return null;
            }
            if (Object.keys(this.load).length > 0) {
                item = new this.model(item);
                var items = this.hook.executeSelectHook('beforeRelations', [item]);
                item = items[0];
                Loader.eagerLoadRelations(this, [item]);
                items = this.hook.executeSelectHook('afterRelations', [item]);
                item = items[0];
            }
            return item;
        };
        /**
         * Create a collection (array) from given records.
         */
        Query.prototype.collect = function (collection) {
            var _this = this;
            if (collection.length < 1) {
                return [];
            }
            if (Object.keys(this.load).length > 0) {
                collection = collection.map(function (item) { return new _this.model(item); });
                collection = this.hook.executeSelectHook('beforeRelations', collection);
                Loader.eagerLoadRelations(this, collection);
                collection = this.hook.executeSelectHook('afterRelations', collection);
            }
            return collection;
        };
        /**
         * Create new data with all fields filled by default values.
         */
        Query.prototype.new = function () {
            var record = (new this.model()).$toJson();
            var result = this.insert(record, {});
            return result[this.entity][0];
        };
        /**
         * Save given data to the store by replacing all existing records in the
         * store. If you want to save data without replacing existing records,
         * use the `insert` method instead.
         */
        Query.prototype.create = function (data, options) {
            return this.persist(data, 'create', options); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Create records to the state.
         */
        Query.prototype.createMany = function (records) {
            var _this = this;
            var instances = this.hydrateMany(records);
            this.commit('create', instances, function () {
                _this.state.data = instances;
            });
            return this.map(instances); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Insert given data to the state. Unlike `create`, this method will not
         * remove existing data within the state, but it will update the data
         * with the same primary key.
         */
        Query.prototype.insert = function (data, options) {
            return this.persist(data, 'insert', options); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Insert list of records in the state.
         */
        Query.prototype.insertMany = function (records) {
            var _this = this;
            var instances = this.hydrateMany(records);
            this.commit('create', instances, function () {
                _this.state.data = __assign({}, _this.state.data, instances);
            });
            return this.map(instances); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Update data in the state.
         */
        Query.prototype.update = function (data, condition, options) {
            // If the data is array, simply normalize the data and update them.
            if (Array.isArray(data)) {
                return this.persist(data, 'update', options);
            }
            // OK, the data is not an array. Now let's check `data` to see what we can
            // do if it's a closure.
            if (typeof data === 'function') {
                // If the data is closure, but if there's no condition, we wouldn't know
                // what record to update so raise an error and abort.
                if (!condition) {
                    throw new Error('You must specify `where` to update records by specifying `data` as a closure.');
                }
                // If the condition is a closure, then update records by the closure.
                if (typeof condition === 'function') {
                    return this.updateByCondition(data, condition);
                }
                // Else the condition is either String or Number, so let's
                // update the record by ID.
                return this.updateById(data, condition);
            }
            // Now the data is not a closure, and it's not an array, so it should be an object.
            // If the condition is closure, we can't normalize the data so let's update
            // records using the closure.
            if (typeof condition === 'function') {
                return this.updateByCondition(data, condition);
            }
            // If there's no condition, let's normalize the data and update them.
            if (!condition) {
                return this.persist(data, 'update', options);
            }
            // Now since the condition is either String or Number, let's check if the
            // model's primary key is not a composite key. If yes, we can't set the
            // condition as ID value for the record so throw an error and abort.
            if (Array.isArray(this.model.primaryKey)) {
                throw new Error("\n        You can't specify `where` value as `string` or `number` when you\n        have a composite key defined in your model. Please include composite\n        keys to the `data` fields.\n      ");
            }
            // Finally, let's add condition as the primary key of the object and
            // then normalize them to update the records.
            return this.updateById(data, condition);
        };
        /**
         * Update all records.
         */
        Query.prototype.updateMany = function (records) {
            var instances = this.combine(records);
            return this.commitUpdate(instances); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Update the state by id.
         */
        Query.prototype.updateById = function (data, id) {
            var _a;
            id = typeof id === 'number' ? id.toString() : id;
            var instance = this.state.data[id];
            if (!instance) {
                return null;
            }
            var instances = (_a = {},
                _a[id] = this.processUpdate(data, instance),
                _a);
            this.commitUpdate(instances);
            return instances[id];
        };
        /**
         * Update the state by condition.
         */
        Query.prototype.updateByCondition = function (data, condition) {
            var _this = this;
            var instances = Object.keys(this.state.data).reduce(function (instances, id) {
                var instance = _this.state.data[id];
                if (!condition(instance)) {
                    return instances;
                }
                instances[id] = _this.processUpdate(data, instance);
                return instances;
            }, {});
            return this.commitUpdate(instances);
        };
        /**
         * Update the given record with given data.
         */
        Query.prototype.processUpdate = function (data, instance) {
            if (typeof data === 'function') {
                data(instance);
                return instance;
            }
            return this.hydrate(__assign({}, instance, data));
        };
        /**
         * Commit `update` to the state.
         */
        Query.prototype.commitUpdate = function (instances) {
            var _this = this;
            instances = this.updateIndexes(instances);
            this.commit('update', instances, function () {
                _this.state.data = __assign({}, _this.state.data, instances);
            });
            return this.map(instances);
        };
        /**
         * Update the key of the instances. This is needed when a user updates
         * record's primary key. We must then update the index key to
         * correspond with new id value.
         */
        Query.prototype.updateIndexes = function (instances) {
            var _this = this;
            return Object.keys(instances).reduce(function (instances, key) {
                var instance = instances[key];
                var id = String(_this.model.id(instance));
                if (key !== id) {
                    instance.$id = id;
                    instances[id] = instance;
                    delete instances[key];
                }
                return instances;
            }, instances);
        };
        /**
         * Insert or update given data to the state. Unlike `insert`, this method
         * will not replace existing data within the state, but it will update only
         * the submitted data with the same primary key.
         */
        Query.prototype.insertOrUpdate = function (data, options) {
            return this.persist(data, 'insertOrUpdate', options); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Insert or update the records.
         */
        Query.prototype.insertOrUpdateMany = function (records) {
            var _this = this;
            var toBeInserted = {};
            var toBeUpdated = {};
            Object.keys(records).forEach(function (id) {
                var record = records[id];
                if (_this.state.data[id]) {
                    toBeUpdated[id] = record;
                    return;
                }
                toBeInserted[id] = record;
            });
            return this.insertMany(toBeInserted).concat(this.updateMany(toBeUpdated));
        };
        /**
         * Persist data into the state.
         */
        Query.prototype.persist = function (data, method, options) {
            var _this = this;
            data = this.normalize(data);
            if (Utils.isEmpty(data)) {
                if (method === 'create') {
                    this.state.data = {};
                }
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
            var _a;
            id = typeof id === 'number' ? id.toString() : id;
            var instance = this.state.data[id];
            if (!instance) {
                return null;
            }
            var instances = (_a = {}, _a[id] = instance, _a);
            var collection = this.commitDelete(instances);
            return collection[0]; // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Delete record by condition.
         */
        Query.prototype.deleteByCondition = function (condition) {
            var _this = this;
            var instances = Object.keys(this.state.data).reduce(function (records, id) {
                var instance = _this.state.data[id];
                if (!condition(instance)) {
                    return records;
                }
                records[id] = instance;
                return records;
            }, {});
            return this.commitDelete(instances); // TODO: Delete "as ..." when model type coverage reaches 100%.
        };
        /**
         * Delete all records from the state.
         */
        Query.prototype.deleteAll = function () {
            var instances = this.state.data;
            this.commitDelete(instances);
        };
        /**
         * Commit `delete` to the state.
         */
        Query.prototype.commitDelete = function (instances) {
            var _this = this;
            this.commit('delete', instances, function () {
                var ids = Object.keys(instances);
                _this.state.data = Object.keys(_this.state.data).reduce(function (instances, id) {
                    if (!ids.includes(id)) {
                        instances[id] = _this.state.data[id];
                    }
                    return instances;
                }, {});
            });
            return this.map(instances);
        };
        /**
         * Normalize the given data.
         */
        Query.prototype.normalize = function (data) {
            return Processor.normalize(this, data);
        };
        /**
         * Convert given record to the model instance.
         */
        Query.prototype.hydrate = function (record) {
            var model = this.model;
            return new model(record);
        };
        /**
         * Convert all given records to model instances.
         */
        Query.prototype.hydrateMany = function (records) {
            var _this = this;
            return Object.keys(records).reduce(function (instances, id) {
                var record = records[id];
                instances[id] = _this.hydrate(record);
                return instances;
            }, {});
        };
        /**
         * Convert given records to instances by merging existing record. If there's
         * no existing record, that record will not be included in the result.
         */
        Query.prototype.combine = function (records) {
            var _this = this;
            return Object.keys(records).reduce(function (instances, id) {
                var instance = _this.state.data[id];
                if (!instance) {
                    return instances;
                }
                var record = records[id];
                instances[id] = _this.hydrate(__assign({}, instance, record));
                return instances;
            }, {});
        };
        /**
         * Convert all given instances to collections.
         */
        Query.prototype.map = function (instances) {
            return Object.keys(instances).map(function (id) { return instances[id]; });
        };
        /**
         * Execute given callback by executing before and after hooks of the specified
         * method to the given instances. The method name should be something like
         * `create` or `update`, then it will be converted to `beforeCreate` ,
         * `afterCreate` and so on.
         */
        Query.prototype.commit = function (method, instances, callback) {
            var name = "" + method.charAt(0).toUpperCase() + method.slice(1);
            this.hook.executeMutationHookOnRecords("before" + name, instances);
            callback();
            this.hook.executeMutationHookOnRecords("after" + name, instances);
        };
        return Query;
    }());

    var Getters = {
        /**
         * Create a new Query instance.
         */
        query: function (state, _getters, _rootState, rootGetters) { return function () {
            return rootGetters[state.$connection + "/query"](state.$name);
        }; },
        /**
         * Get all data of given entity.
         */
        all: function (state, _getters, _rootState, rootGetters) { return function () {
            return rootGetters[state.$connection + "/all"](state.$name);
        }; },
        /**
         * Find a data of the given entity by given id.
         */
        find: function (state, _getters, _rootState, rootGetters) { return function (id) {
            return rootGetters[state.$connection + "/find"](state.$name, id);
        }; },
        /**
         * Find array of data of the given entity by given ids.
         */
        findIn: function (state, _getters, _rootState, rootGetters) { return function (idList) {
            return rootGetters[state.$connection + "/findIn"](state.$name, idList);
        }; }
    };

    var Actions = {
        /**
         * Create new data with all fields filled by default values.
         */
        new: function (context) {
            var state = context.state;
            var entity = state.$name;
            return context.dispatch(state.$connection + "/new", { entity: entity }, { root: true });
        },
        /**
         * Save given data to the store by replacing all existing records in the
         * store. If you want to save data without replacing existing records,
         * use the `insert` method instead.
         */
        create: function (context, payload) {
            var state = context.state;
            var entity = state.$name;
            return context.dispatch(state.$connection + "/create", __assign({}, payload, { entity: entity }), { root: true });
        },
        /**
         * Insert given data to the state. Unlike `create`, this method will not
         * remove existing data within the state, but it will update the data
         * with the same primary key.
         */
        insert: function (context, payload) {
            var state = context.state;
            var entity = state.$name;
            return context.dispatch(state.$connection + "/insert", __assign({}, payload, { entity: entity }), { root: true });
        },
        /**
         * Update data in the store.
         */
        update: function (context, payload) {
            var state = context.state;
            var entity = state.$name;
            // If the payload is an array, then the payload should be an array of
            // data so let's pass the whole payload as data.
            if (Array.isArray(payload)) {
                return context.dispatch(state.$connection + "/update", { entity: entity, data: payload }, { root: true });
            }
            // If the payload doesn't have `data` property, we'll assume that
            // the user has passed the object as the payload so let's define
            // the whole payload as a data.
            if (payload.data === undefined) {
                return context.dispatch(state.$connection + "/update", { entity: entity, data: payload }, { root: true });
            }
            // Else destructure the payload and let root action handle it.
            return context.dispatch(state.$connection + "/update", __assign({ entity: entity }, payload), { root: true });
        },
        /**
         * Insert or update given data to the state. Unlike `insert`, this method
         * will not replace existing data within the state, but it will update only
         * the submitted data with the same primary key.
         */
        insertOrUpdate: function (context, payload) {
            var state = context.state;
            var entity = state.$name;
            return context.dispatch(state.$connection + "/insertOrUpdate", __assign({ entity: entity }, payload), { root: true });
        },
        /**
         * Delete data from the store.
         */
        delete: function (context, payload) {
            var state = context.state;
            var entity = state.$name;
            var where = typeof payload === 'object' ? payload.where : payload;
            return context.dispatch(state.$connection + "/delete", { entity: entity, where: where }, { root: true });
        },
        /**
         * Delete all data from the store.
         */
        deleteAll: function (context) {
            var state = context.state;
            var entity = state.$name;
            return context.dispatch(state.$connection + "/deleteAll", { entity: entity }, { root: true });
        }
    };

    var RootGetters = {
        /**
         * Create a new Query instance.
         */
        query: function (state) { return function (entity) {
            return new Query(state, entity);
        }; },
        /**
         * Get all data of given entity.
         */
        all: function (state) { return function (entity) {
            return (new Query(state, entity)).all();
        }; },
        /**
         * Find a data of the given entity by given id.
         */
        find: function (state) { return function (entity, id) {
            return (new Query(state, entity)).find(id);
        }; },
        /**
         * Find a data of the given entity by given id.
         */
        findIn: function (state) { return function (entity, idList) {
            return (new Query(state, entity)).findIn(idList);
        }; }
    };

    var RootActions = {
        /**
         * Create new data with all fields filled by default values.
         */
        new: function (context, payload) {
            var result = { data: {} };
            context.commit('new', __assign({}, payload, { result: result }));
            return result.data;
        },
        /**
         * Save given data to the store by replacing all existing records in the
         * store. If you want to save data without replacing existing records,
         * use the `insert` method instead.
         */
        create: function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    result = { data: {} };
                    context.commit('create', __assign({}, payload, { result: result }));
                    return [2 /*return*/, result.data];
                });
            });
        },
        /**
         * Insert given data to the state. Unlike `create`, this method will not
         * remove existing data within the state, but it will update the data
         * with the same primary key.
         */
        insert: function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    result = { data: {} };
                    context.commit('insert', __assign({}, payload, { result: result }));
                    return [2 /*return*/, result.data];
                });
            });
        },
        /**
         * Update data in the store.
         */
        update: function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    result = { data: {} };
                    context.commit('update', __assign({}, payload, { result: result }));
                    return [2 /*return*/, result.data];
                });
            });
        },
        /**
         * Insert or update given data to the state. Unlike `insert`, this method
         * will not replace existing data within the state, but it will update only
         * the submitted data with the same primary key.
         */
        insertOrUpdate: function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    result = { data: {} };
                    context.commit('insertOrUpdate', __assign({}, payload, { result: result }));
                    return [2 /*return*/, result.data];
                });
            });
        },
        /**
         * Delete data from the store.
         */
        delete: function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    result = { data: {} };
                    context.commit('delete', __assign({}, payload, { result: result }));
                    return [2 /*return*/, result.data];
                });
            });
        },
        /**
         * Delete all data from the store.
         */
        deleteAll: function (context, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (payload && payload.entity) {
                        context.commit('deleteAll', { entity: payload.entity });
                        return [2 /*return*/];
                    }
                    context.commit('deleteAll');
                    return [2 /*return*/];
                });
            });
        }
    };

    var OptionsBuilder = /** @class */ (function () {
        function OptionsBuilder() {
        }
        /**
         * Get persist options from the given payload.
         */
        OptionsBuilder.createPersistOptions = function (payload) {
            return {
                create: payload.create,
                insert: payload.insert,
                update: payload.update,
                insertOrUpdate: payload.insertOrUpdate
            };
        };
        return OptionsBuilder;
    }());

    var RootMutations = {
        /**
         * Execute generic mutation. This method is used by `Model.commit` method so
         * that user can commit any state changes easily through models.
         */
        $mutate: function (state, payload) {
            payload.callback(state[payload.entity]);
        },
        /**
         * Create new data with all fields filled by default values.
         */
        new: function (state, payload) {
            var entity = payload.entity;
            var result = payload.result;
            result.data = (new Query(state, entity)).new();
        },
        /**
         * Save given data to the store by replacing all existing records in the
         * store. If you want to save data without replacing existing records,
         * use the `insert` method instead.
         */
        create: function (state, payload) {
            var entity = payload.entity;
            var data = payload.data;
            var options = OptionsBuilder.createPersistOptions(payload);
            var result = payload.result;
            result.data = (new Query(state, entity)).create(data, options);
        },
        /**
         * Insert given data to the state. Unlike `create`, this method will not
         * remove existing data within the state, but it will update the data
         * with the same primary key.
         */
        insert: function (state, payload) {
            var entity = payload.entity;
            var data = payload.data;
            var options = OptionsBuilder.createPersistOptions(payload);
            var result = payload.result;
            result.data = (new Query(state, entity)).insert(data, options);
        },
        /**
         * Update data in the store.
         */
        update: function (state, payload) {
            var entity = payload.entity;
            var data = payload.data;
            var where = payload.where || null;
            var options = OptionsBuilder.createPersistOptions(payload);
            var result = payload.result;
            result.data = (new Query(state, entity)).update(data, where, options);
        },
        /**
         * Insert or update given data to the state. Unlike `insert`, this method
         * will not replace existing data within the state, but it will update only
         * the submitted data with the same primary key.
         */
        insertOrUpdate: function (state, payload) {
            var entity = payload.entity;
            var data = payload.data;
            var options = OptionsBuilder.createPersistOptions(payload);
            var result = payload.result;
            result.data = (new Query(state, entity)).insertOrUpdate(data, options);
        },
        /**
         * Delete data from the store.
         */
        delete: function (state, payload) {
            var entity = payload.entity;
            var where = payload.where;
            var result = payload.result;
            result.data = (new Query(state, entity)).delete(where);
        },
        /**
         * Delete all data from the store.
         */
        deleteAll: function (state, payload) {
            if (payload && payload.entity) {
                (new Query(state, payload.entity)).deleteAll();
                return;
            }
            Query.deleteAll(state);
        }
    };

    function use (plugin, options) {
        if (options === void 0) { options = {}; }
        var components = {
            Model: Model,
            Query: Query,
            Attribute: Attribute,
            Type: Type,
            Attr: Attr,
            String: String$1,
            Number: Number,
            Boolean: Boolean,
            Increment: Increment,
            Relation: Relation,
            HasOne: HasOne,
            BelongsTo: BelongsTo,
            HasMany: HasMany,
            HasManyBy: HasManyBy,
            BelongsToMany: BelongsToMany,
            HasManyThrough: HasManyThrough,
            MorphTo: MorphTo,
            MorphOne: MorphOne,
            MorphMany: MorphMany,
            MorphToMany: MorphToMany,
            MorphedByMany: MorphedByMany,
            Getters: Getters,
            Actions: Actions,
            RootGetters: RootGetters,
            RootActions: RootActions,
            RootMutations: RootMutations
        };
        plugin.install(components, options);
    }

    /* istanbul ignore next */
    var NoKey = /** @class */ (function () {
        function NoKey() {
        }
        /**
         * Set new unique id value.
         */
        NoKey.set = function () {
            this.value = "" + this.prefix + this.count;
        };
        /**
         * Get the current unique id value.
         */
        NoKey.get = function () {
            return this.value;
        };
        /**
         * Increment the count, new unique id value.
         */
        NoKey.increment = function () {
            this.count++;
            this.set();
            return this.get();
        };
        /**
         * Count to create a unique id for the record that missing its primary key.
         */
        NoKey.count = 0;
        /**
         * Prefix string to be used for undefined primary key value.
         */
        NoKey.prefix = '_no_key_';
        /**
         * The current unique id value. This is the combination of
         * the `prefix` and the `count`.
         */
        NoKey.value = '';
        return NoKey;
    }());

    var IdAttribute = /** @class */ (function () {
        function IdAttribute() {
        }
        /**
         * Create the id attribute.
         */
        IdAttribute.create = function (model) {
            return function (value, _parent, _key) {
                var id = model.id(value);
                return id === undefined || id === null || id === '' ? NoKey.get() : id;
            };
        };
        return IdAttribute;
    }());

    var ProcessStrategy = /** @class */ (function () {
        function ProcessStrategy() {
        }
        /**
         * Create the process strategy.
         */
        ProcessStrategy.create = function (model) {
            var _this = this;
            return function (value, _parentValue, _key) {
                var id = _this.getId(model, value);
                return __assign({}, value, { $id: id });
            };
        };
        /**
         * Get the ID value for the given record.
         */
        ProcessStrategy.getId = function (model, value) {
            var id = model.id(value);
            return id === undefined || id === null || id === '' ? NoKey.increment() : id;
        };
        return ProcessStrategy;
    }());

    var Schema = /** @class */ (function () {
        /**
         * Create a new schema instance.
         */
        function Schema(model) {
            var _this = this;
            /**
             * List of generated schemas.
             */
            this.schemas = {};
            this.model = model;
            var models = model.database().models();
            Object.keys(models).forEach(function (name) { _this.one(models[name]); });
        }
        /**
         * Create a schema for the given model.
         */
        Schema.create = function (model) {
            return (new this(model)).one();
        };
        /**
         * Create a single schema for the given model.
         */
        Schema.prototype.one = function (model) {
            model = model || this.model;
            if (this.schemas[model.entity]) {
                return this.schemas[model.entity];
            }
            var schema$1 = new schema.Entity(model.entity, {}, {
                idAttribute: IdAttribute.create(model),
                processStrategy: ProcessStrategy.create(model)
            });
            this.schemas[model.entity] = schema$1;
            var definition = this.definition(model);
            schema$1.define(definition);
            return schema$1;
        };
        /**
         * Create an array schema for the given model.
         */
        Schema.prototype.many = function (model) {
            return new schema.Array(this.one(model));
        };
        /**
         * Create an union schema for the given model.
         */
        Schema.prototype.union = function (callback) {
            return new schema.Union(this.schemas, callback);
        };
        /**
         * Create a dfinition for the given model.
         */
        Schema.prototype.definition = function (model) {
            var _this = this;
            var fields = model.fields();
            return Object.keys(fields).reduce(function (definition, key) {
                var field = fields[key];
                if (field instanceof Relation) {
                    definition[key] = field.define(_this);
                }
                return definition;
            }, {});
        };
        return Schema;
    }());

    var Builder = /** @class */ (function () {
        function Builder() {
        }
        /**
         * Create module from the given modules.
         */
        Builder.create = function (namespace, models, modules) {
            var tree = {
                namespaced: true,
                state: { $name: namespace },
                getters: RootGetters,
                actions: RootActions,
                mutations: RootMutations,
                modules: {}
            };
            return this.createModules(tree, namespace, models, modules);
        };
        /**
         * Creates module tree to be registered under top level module
         * from the given entities.
         */
        Builder.createModules = function (tree, namespace, models, modules) {
            var _this = this;
            Object.keys(modules).forEach(function (name) {
                var model = models[name];
                var module = modules[name];
                tree.modules[name] = { namespaced: true };
                tree.modules[name].state = _this.createState(namespace, name, model, module);
                tree.getters[name] = function (_state, getters, _rootState, _rootGetters) { return function () {
                    return getters.query(name);
                }; };
                tree.modules[name].getters = __assign({}, Getters, module.getters);
                tree.modules[name].actions = __assign({}, Actions, module.actions);
                tree.modules[name].mutations = module.mutations || {};
            });
            return tree;
        };
        /**
         * Get new state to be registered to the modules.
         */
        Builder.createState = function (namespace, name, model, module) {
            var modelState = typeof model.state === 'function' ? model.state() : model.state;
            var moduleState = typeof module.state === 'function' ? module.state() : module.state;
            return __assign({}, modelState, moduleState, { $connection: namespace, $name: name, data: {} });
        };
        return Builder;
    }());

    var Database = /** @class */ (function () {
        function Database() {
            /**
             * The list of entities to be registered to the Vuex Store. It contains
             * models and modules with its name.
             */
            this.entities = [];
            /**
             * The database schema definition. This schema will be used when normalizing
             * the data before persisting them to the Vuex Store.
             */
            this.schemas = {};
        }
        /**
         * Initialize the database before a user can start using it.
         */
        Database.prototype.start = function (store, namespace) {
            this.store = store;
            this.namespace = namespace;
            this.registerModules();
            this.createSchema();
        };
        /**
         * Register a model and a module to Database.
         */
        Database.prototype.register = function (model, module) {
            if (module === void 0) { module = {}; }
            this.entities.push({
                name: model.entity,
                model: model,
                module: module
            });
        };
        /**
         * Get the model of the given name from the entities list.
         */
        Database.prototype.model = function (name) {
            return this.models()[name];
        };
        /**
         * Get all models from the entities list.
         */
        Database.prototype.models = function () {
            return this.entities.reduce(function (models, entity) {
                models[entity.name] = entity.model;
                return models;
            }, {});
        };
        /**
         * Get the module of the given name from the entities list.
         */
        Database.prototype.module = function (name) {
            return this.modules()[name];
        };
        /**
         * Get all modules from the entities list.
         */
        Database.prototype.modules = function () {
            return this.entities.reduce(function (modules, entity) {
                modules[entity.name] = entity.module;
                return modules;
            }, {});
        };
        /**
         * Create the Vuex Module from registered entities.
         */
        Database.prototype.registerModules = function () {
            var modules = Builder.create(this.namespace, this.models(), this.modules());
            this.store.registerModule(this.namespace, modules);
        };
        /**
         * Create the schema definition from registered entities list and set
         * it to the property. This schema will be used by the normalizer
         * to normalize data before persisting them to the Vuex Store.
         */
        Database.prototype.createSchema = function () {
            var _this = this;
            this.entities.forEach(function (entity) {
                _this.schemas[entity.name] = Schema.create(entity.model);
            });
        };
        return Database;
    }());

    var index_cjs = {
        install: install,
        use: use,
        Database: Database,
        Model: Model,
        Query: Query,
        Attribute: Attribute,
        Type: Type,
        Attr: Attr,
        String: String$1,
        Number: Number,
        Boolean: Boolean,
        Increment: Increment,
        Relation: Relation,
        HasOne: HasOne,
        BelongsTo: BelongsTo,
        HasMany: HasMany,
        HasManyBy: HasManyBy,
        BelongsToMany: BelongsToMany,
        HasManyThrough: HasManyThrough,
        MorphTo: MorphTo,
        MorphOne: MorphOne,
        MorphMany: MorphMany,
        MorphToMany: MorphToMany,
        MorphedByMany: MorphedByMany,
        Getters: Getters,
        Actions: Actions,
        RootGetters: RootGetters,
        RootActions: RootActions,
        RootMutations: RootMutations
    };

    return index_cjs;

}));
