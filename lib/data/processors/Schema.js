var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { schema } from 'normalizr';
import Utils from '../../support/Utils';
import Attrs from '../../attributes/contracts/Contract';
import HasOne from '../../attributes/relations/HasOne';
import BelongsTo from '../../attributes/relations/BelongsTo';
import HasMany from '../../attributes/relations/HasMany';
import HasManyBy from '../../attributes/relations/HasManyBy';
import HasManyThrough from '../../attributes/relations/HasManyThrough';
import BelongsToMany from '../../attributes/relations/BelongsToMany';
import MorphTo from '../../attributes/relations/MorphTo';
import MorphOne from '../../attributes/relations/MorphOne';
import MorphMany from '../../attributes/relations/MorphMany';
import MorphToMany from '../../attributes/relations/MorphToMany';
import MorphedByMany from '../../attributes/relations/MorphedByMany';
import NoKey from './NoKey';
import IdAttribute from './IdAttribute';
import ProcessStrategy from './ProcessStrategy';
var Schema = /** @class */ (function () {
    function Schema() {
    }
    /**
     * Create a schema for the given model.
     */
    Schema.one = function (model, schemas, parent, attr) {
        if (schemas === void 0) { schemas = {}; }
        var _a;
        var noKey = new NoKey();
        var thisSchema = new schema.Entity(model.entity, {}, {
            idAttribute: IdAttribute.create(noKey, model),
            processStrategy: ProcessStrategy.create(noKey, model, parent, attr)
        });
        var definition = this.definition(model, __assign({}, schemas, (_a = {}, _a[model.entity] = thisSchema, _a)));
        thisSchema.define(definition);
        return thisSchema;
    };
    /**
     * Create an array schema for the given model.
     */
    Schema.many = function (model, schemas, parent, attr) {
        if (schemas === void 0) { schemas = {}; }
        return new schema.Array(this.one(model, schemas, parent, attr));
    };
    /**
     * Create a dfinition for the given model.
     */
    Schema.definition = function (model, schemas, fields) {
        var _this = this;
        var theFields = fields || model.fields();
        return Object.keys(theFields).reduce(function (definition, key) {
            var field = theFields[key];
            var def = _this.buildRelations(model, field, schemas);
            if (def) {
                definition[key] = def;
            }
            return definition;
        }, {});
    };
    /**
     * Build normalizr schema definition from the given relation.
     */
    Schema.buildRelations = function (model, field, schemas) {
        if (!Attrs.isAttribute(field)) {
            return this.definition(model, schemas, field);
        }
        if (field instanceof HasOne) {
            return this.buildOne(field.related, schemas, model, field);
        }
        if (field instanceof BelongsTo) {
            return this.buildOne(field.parent, schemas, model, field);
        }
        if (field instanceof HasMany) {
            return this.buildMany(field.related, schemas, model, field);
        }
        if (field instanceof HasManyBy) {
            return this.buildMany(field.parent, schemas, model, field);
        }
        if (field instanceof HasManyThrough) {
            return this.buildMany(field.related, schemas, model, field);
        }
        if (field instanceof BelongsToMany) {
            return this.buildMany(field.related, schemas, model, field);
        }
        if (field instanceof MorphTo) {
            return this.buildMorphOne(field, schemas, model);
        }
        if (field instanceof MorphOne) {
            return this.buildOne(field.related, schemas, model, field);
        }
        if (field instanceof MorphMany) {
            return this.buildMany(field.related, schemas, model, field);
        }
        if (field instanceof MorphToMany) {
            return this.buildMany(field.related, schemas, model, field);
        }
        if (field instanceof MorphedByMany) {
            return this.buildMany(field.related, schemas, model, field);
        }
        return null;
    };
    /**
     * Build a single entity schema definition.
     */
    Schema.buildOne = function (related, schemas, parent, attr) {
        var s = schemas[related.entity];
        return s || this.one(related, schemas, parent, attr);
    };
    /**
     * Build a array entity schema definition.
     */
    Schema.buildMany = function (related, schemas, parent, attr) {
        var s = schemas[related.entity];
        return s ? new schema.Array(s) : this.many(related, schemas, parent, attr);
    };
    /**
     * Build a morph schema definition.
     */
    Schema.buildMorphOne = function (attr, schemas, parent) {
        var _this = this;
        var s = Utils.mapValues(parent.conn().models(), function (model) {
            return _this.buildOne(model, schemas, model, attr);
        });
        return new schema.Union(s, function (_value, parentValue) { return parentValue[attr.type]; });
    };
    return Schema;
}());
export default Schema;
//# sourceMappingURL=Schema.js.map