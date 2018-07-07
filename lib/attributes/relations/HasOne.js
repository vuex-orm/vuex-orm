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
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    HasOne.prototype.fill = function (value) {
        if (value === undefined) {
            return null;
        }
        if (Array.isArray(value)) {
            return null;
        }
        return value;
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    HasOne.prototype.make = function (value, _parent, _key) {
        if (value === null) {
            return null;
        }
        if (value === undefined) {
            return null;
        }
        if (Array.isArray(value)) {
            return null;
        }
        return new this.related(value);
    };
    /**
     * Attach the relational key to the given record.
     */
    HasOne.prototype.attach = function (key, record, data) {
        var related = data[this.related.entity];
        if (related && related[key] && related[key][this.foreignKey] !== undefined) {
            return;
        }
        if (!record[this.localKey]) {
            record[this.localKey] = record.$id;
        }
        related[key][this.foreignKey] = record[this.localKey];
    };
    /**
     * Load the has one relationship for the record.
     */
    HasOne.prototype.load = function (query, collection, relation) {
        var _this = this;
        var relatedPath = this.relatedPath(relation.name);
        var relatedQuery = new Query(query.rootState, this.related.entity, false);
        this.addConstraint(relatedQuery, relation);
        var relatedRecords = this.mapRecords(relatedQuery.get(), this.foreignKey);
        return collection.map(function (item) {
            var related = relatedRecords[item[_this.localKey]];
            return _this.setRelated(item, related || null, relatedPath);
        });
    };
    return HasOne;
}(Relation));
export default HasOne;
//# sourceMappingURL=HasOne.js.map