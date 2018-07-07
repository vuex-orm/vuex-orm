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
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    HasMany.prototype.fill = function (value) {
        return Array.isArray(value) ? value : [];
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    HasMany.prototype.make = function (value, _parent, _key) {
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
            return new _this.related(record);
        });
    };
    /**
     * Attach the relational key to the given record.
     */
    HasMany.prototype.attach = function (key, record, data) {
        var _this = this;
        key.forEach(function (index) {
            var related = data[_this.related.entity];
            if (!related || !related[index] || related[index][_this.foreignKey] !== undefined) {
                return;
            }
            related[index][_this.foreignKey] = record.$id;
        });
    };
    /**
     * Load the has many relationship for the record.
     */
    HasMany.prototype.load = function (query, collection, relation) {
        var _this = this;
        var relatedQuery = new Query(query.rootState, this.related.entity, false);
        this.addConstraint(relatedQuery, relation);
        var relatedRecords = relatedQuery.get().reduce(function (records, record) {
            var key = record[_this.foreignKey];
            if (!records[key]) {
                records[key] = [];
            }
            records[key].push(record);
            return records;
        }, {});
        var relatedPath = this.relatedPath(relation.name);
        return collection.map(function (item) {
            var related = relatedRecords[item[_this.localKey]];
            return _this.setRelated(item, related || [], relatedPath);
        });
    };
    return HasMany;
}(Relation));
export default HasMany;
//# sourceMappingURL=HasMany.js.map