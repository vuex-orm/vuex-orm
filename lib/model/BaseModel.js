import Utils from '../support/Utils';
import Container from '../connections/Container';
import AttrContract from '../attributes/contracts/Contract';
import Attribute from '../attributes/Attribute';
import Attr from '../attributes/types/Attr';
import String from '../attributes/types/String';
import Number from '../attributes/types/Number';
import Boolean from '../attributes/types/Boolean';
import Increment from '../attributes/types/Increment';
import HasOne from '../attributes/relations/HasOne';
import BelongsTo from '../attributes/relations/BelongsTo';
import HasMany from '../attributes/relations/HasMany';
import HasManyBy from '../attributes/relations/HasManyBy';
import HasManyThrough from '../attributes/relations/HasManyThrough';
import BelongsToMany from '../attributes/relations/BelongsToMany';
import MorphTo from '../attributes/relations/MorphTo';
import MorphOne from '../attributes/relations/MorphOne';
import MorphMany from '../attributes/relations/MorphMany';
import MorphToMany from '../attributes/relations/MorphToMany';
import MorphedByMany from '../attributes/relations/MorphedByMany';
var BaseModel = /** @class */ (function () {
    /**
     * Create a model instance.
     */
    function BaseModel(record) {
        this.$fill(record);
    }
    /**
     * The definition of the fields of the model and its relations.
     */
    BaseModel.fields = function () {
        return {};
    };
    /**
     * Create an attr attribute. The given value will be used as a default
     * value for the field.
     */
    BaseModel.attr = function (value, mutator) {
        return new Attr(this, value, mutator);
    };
    /**
     * Create a string attribute.
     */
    BaseModel.string = function (value, mutator) {
        return new String(this, value, mutator);
    };
    /**
     * Create a number attribute.
     */
    BaseModel.number = function (value, mutator) {
        return new Number(this, value, mutator);
    };
    /**
     * Create a boolean attribute.
     */
    BaseModel.boolean = function (value, mutator) {
        return new Boolean(this, value, mutator);
    };
    /**
     * Create an increment attribute. The field with this attribute will
     * automatically increment its value when creating a new record.
     */
    BaseModel.increment = function () {
        return new Increment(this);
    };
    /**
     * Create a has one relationship.
     */
    BaseModel.hasOne = function (related, foreignKey, localKey) {
        return new HasOne(this, related, foreignKey, this.localKey(localKey));
    };
    /**
     * Create a belongs to relationship.
     */
    BaseModel.belongsTo = function (parent, foreignKey, ownerKey) {
        return new BelongsTo(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
    };
    /**
     * Create a has many relationship.
     */
    BaseModel.hasMany = function (related, foreignKey, localKey) {
        return new HasMany(this, related, foreignKey, this.localKey(localKey));
    };
    /**
     * Create a has many by relationship.
     */
    BaseModel.hasManyBy = function (parent, foreignKey, ownerKey) {
        return new HasManyBy(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
    };
    /**
     * Create a has many through relationship.
     */
    BaseModel.hasManyThrough = function (related, through, firstKey, secondKey, localKey, secondLocalKey) {
        return new HasManyThrough(this, related, through, firstKey, secondKey, this.localKey(localKey), this.relation(through).localKey(secondLocalKey));
    };
    /**
     * The belongs to many relationship.
     */
    BaseModel.belongsToMany = function (related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
        return new BelongsToMany(this, related, pivot, foreignPivotKey, relatedPivotKey, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Create a morph to relationship.
     */
    BaseModel.morphTo = function (id, type) {
        return new MorphTo(this, id, type);
    };
    /**
     * Create a morph one relationship.
     */
    BaseModel.morphOne = function (related, id, type, localKey) {
        return new MorphOne(this, related, id, type, this.localKey(localKey));
    };
    /**
     * Create a morph many relationship.
     */
    BaseModel.morphMany = function (related, id, type, localKey) {
        return new MorphMany(this, related, id, type, this.localKey(localKey));
    };
    /**
     * Create a morph to many relationship.
     */
    BaseModel.morphToMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
        return new MorphToMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Create a morphed by many relationship.
     */
    BaseModel.morphedByMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
        return new MorphedByMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Mutators to mutate matching fields when instantiating the model.
     */
    BaseModel.mutators = function () {
        return {};
    };
    /**
     * Get connection instance out of the container.
     */
    BaseModel.conn = function () {
        return Container.connection(this.connection);
    };
    /**
     * Get Vuex Store instance out of connection.
     */
    BaseModel.store = function () {
        return this.conn().store();
    };
    /**
     * Get module namespaced path for the model.
     */
    BaseModel.namespace = function (method) {
        return this.connection + "/" + this.entity + "/" + method;
    };
    /**
     * Dispatch an action.
     */
    BaseModel.dispatch = function (method, payload) {
        return this.store().dispatch(this.namespace(method), payload);
    };
    /**
     * Call getetrs.
     */
    BaseModel.getters = function (method) {
        return this.store().getters[this.namespace(method)];
    };
    /**
     * Get the value of the primary key.
     */
    BaseModel.id = function (record) {
        var key = this.primaryKey;
        if (typeof key === 'string') {
            return record[key];
        }
        return key.map(function (k) { return record[k]; }).join('_');
    };
    /**
     * Get local key to pass to the attributes.
     */
    BaseModel.localKey = function (key) {
        if (key) {
            return key;
        }
        return typeof this.primaryKey === 'string' ? this.primaryKey : 'id';
    };
    /**
     * Get a model from the container.
     */
    BaseModel.relation = function (model) {
        if (typeof model !== 'string') {
            return model;
        }
        return this.conn().model(model);
    };
    /**
     * Get the attribute class for the given attribute name.
     */
    BaseModel.getAttributeClass = function (name) {
        switch (name) {
            case 'increment': return Increment;
            default:
                throw Error("The attribute name \"" + name + "\" doesn't exists.");
        }
    };
    /**
     * Get all of the fields that matches the given attribute name.
     */
    BaseModel.getFields = function (name) {
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
    BaseModel.getIncrementFields = function () {
        return this.getFields('increment');
    };
    /**
     * Check if fields contains the `increment` field type.
     */
    BaseModel.hasIncrementFields = function () {
        return Object.keys(this.getIncrementFields()).length > 0;
    };
    /**
     * Get all `belongsToMany` fields from the schema.
     */
    BaseModel.pivotFields = function () {
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
    BaseModel.hasPivotFields = function () {
        return this.pivotFields().length > 0;
    };
    /**
     * Remove any fields not defined in the model schema. This method
     * also fixes any incorrect values as well.
     */
    BaseModel.fix = function (data, keep, fields) {
        var _this = this;
        if (keep === void 0) { keep = ['$id']; }
        var _fields = fields || this.fields();
        return Object.keys(data).reduce(function (record, key) {
            var value = data[key];
            var field = _fields[key];
            if (keep.includes(key)) {
                record[key] = value;
                return record;
            }
            if (!field) {
                return record;
            }
            if (field instanceof Attribute) {
                record[key] = field.fill(value);
                return record;
            }
            record[key] = _this.fix(value, [], field);
            return record;
        }, {});
    };
    /**
     * Fix multiple records.
     */
    BaseModel.fixMany = function (data, keep) {
        var _this = this;
        return Object.keys(data).reduce(function (records, id) {
            records[id] = _this.fix(data[id], keep);
            return records;
        }, {});
    };
    /**
     * Fill any missing fields in the given data with the default
     * value defined in the model schema.
     */
    BaseModel.hydrate = function (data, keep, fields) {
        var _this = this;
        if (keep === void 0) { keep = ['$id']; }
        var _fields = fields || this.fields();
        var record = Object.keys(_fields).reduce(function (record, key) {
            var field = _fields[key];
            var value = data[key];
            if (field instanceof Attribute) {
                record[key] = field.fill(value);
                return record;
            }
            record[key] = _this.hydrate(value || [], [], field);
            return record;
        }, {});
        return Object.keys(data).reduce(function (record, key) {
            if (keep.includes(key) && data[key] !== undefined) {
                record[key] = data[key];
            }
            return record;
        }, record);
    };
    /**
     * Fill multiple records.
     */
    BaseModel.hydrateMany = function (data, keep) {
        var _this = this;
        return Object.keys(data).reduce(function (records, id) {
            records[id] = _this.hydrate(data[id], keep);
            return records;
        }, {});
    };
    /**
     * Fill the given obejct with the given record. If no record were passed,
     * or if the record has any missing fields, each value of the fields will
     * be filled with its default value defined at model fields definition.
     */
    BaseModel.fill = function (self, record, fields) {
        var _this = this;
        if (self === void 0) { self = {}; }
        if (record === void 0) { record = {}; }
        var theFields = fields || this.fields();
        return Object.keys(theFields).reduce(function (target, key) {
            var field = theFields[key];
            var value = record[key];
            if (field instanceof Attribute) {
                target[key] = field.make(value, record, key);
                return target;
            }
            target[key] = _this.fill(target[key], value, field);
            return target;
        }, self);
    };
    /**
     * Get the static class of this model.
     */
    BaseModel.prototype.$self = function () {
        return this.constructor;
    };
    /**
     * The definition of the fields of the model and its relations.
     */
    BaseModel.prototype.$fields = function () {
        return this.$self().fields();
    };
    /**
     * Get the value of the primary key.
     */
    BaseModel.prototype.$id = function () {
        return this.$self().id(this);
    };
    /**
     * Get the connection instance out of the container.
     */
    BaseModel.prototype.$conn = function () {
        return this.$self().conn();
    };
    /**
     * Get Vuex Store insatnce out of connection.
     */
    BaseModel.prototype.$store = function () {
        return this.$self().store();
    };
    /**
     * Get module namespaced path for the model.
     */
    BaseModel.prototype.$namespace = function (method) {
        return this.$self().namespace(method);
    };
    /**
     * Dispatch an action.
     */
    BaseModel.prototype.$dispatch = function (method, payload) {
        return this.$self().dispatch(method, payload);
    };
    /**
     * Call getetrs.
     */
    BaseModel.prototype.$getters = function (method) {
        return this.$self().getters(method);
    };
    /**
     * Fill the model instance with the given record. If no record were passed,
     * or if the record has any missing fields, each value of the fields will
     * be filled with its default value defined at model fields definition.
     */
    BaseModel.prototype.$fill = function (record) {
        this.$self().fill(this, record);
    };
    /**
     * Serialize field values into json.
     */
    BaseModel.prototype.$toJson = function () {
        return this.$buildJson(this.$self().fields(), this);
    };
    /**
     * Build Json data.
     */
    BaseModel.prototype.$buildJson = function (data, field) {
        return Utils.mapValues(data, function (attr, key) {
            if (!field[key]) {
                return field[key];
            }
            if (!AttrContract.isAttribute(attr)) {
                return field.$buildJson(attr, field[key]);
            }
            if (attr instanceof HasOne || attr instanceof BelongsTo) {
                return field[key].$toJson();
            }
            if (attr instanceof HasMany) {
                return field[key].map(function (BaseModel) { return BaseModel.$toJson(); });
            }
            return field[key];
        });
    };
    /**
     * The primary key to be used for the model.
     */
    BaseModel.primaryKey = 'id';
    return BaseModel;
}());
export default BaseModel;
//# sourceMappingURL=BaseModel.js.map