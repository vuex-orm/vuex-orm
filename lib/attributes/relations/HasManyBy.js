var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Query from '../../query/Query';
import Relation from './Relation';
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
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    HasManyBy.prototype.fill = function (value) {
        return Array.isArray(value) ? value : [];
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    HasManyBy.prototype.make = function (value, _parent, _key) {
        var _this = this;
        if (value === null) {
            return [];
        }
        if (value === undefined) {
            return [];
        }
        if (!Array.isArray(value)) {
            return [];
        }
        if (value.length === 0) {
            return [];
        }
        return value.filter(function (record) {
            return record && typeof record === 'object';
        }).map(function (record) {
            return new _this.parent(record);
        });
    };
    /**
     * Attach the relational key to the given record.
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
     * Load the has many by relationship for the record.
     */
    HasManyBy.prototype.load = function (query, collection, relation) {
        var _this = this;
        var relatedPath = this.relatedPath(relation.name);
        var relatedQuery = new Query(query.rootState, this.parent.entity, false);
        this.addConstraint(relatedQuery, relation);
        var relatedRecords = this.mapRecords(relatedQuery.get(), this.ownerKey);
        return collection.map(function (item) {
            var related = item[relation.name].reduce(function (related, id) {
                if (relatedRecords[id]) {
                    related.push(relatedRecords[id]);
                }
                return related;
            }, []);
            return _this.setRelated(item, related, relatedPath);
        });
    };
    return HasManyBy;
}(Relation));
export default HasManyBy;
//# sourceMappingURL=HasManyBy.js.map