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
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    MorphTo.prototype.fill = function (value) {
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
    MorphTo.prototype.make = function (value, parent, _key) {
        if (value === null) {
            return null;
        }
        if (value === undefined) {
            return null;
        }
        if (Array.isArray(value)) {
            return null;
        }
        var related = parent[this.type];
        var BaseModel = this.model.relation(related);
        return BaseModel ? new BaseModel(value) : null;
    };
    /**
     * Attach the relational key to the given record.
     */
    MorphTo.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphTo.prototype.load = function (query, collection, relation) {
        var _this = this;
        var relatedRecords = Object.keys(query.getModels()).reduce(function (records, name) {
            if (name === query.entity) {
                return records;
            }
            var relatedQuery = new Query(query.rootState, name, false);
            _this.addConstraint(relatedQuery, relation);
            records[name] = _this.mapRecords(relatedQuery.get(), '$id');
            return records;
        }, {});
        var relatedPath = this.relatedPath(relation.name);
        return collection.map(function (item) {
            var related = relatedRecords[item[_this.type]][item[_this.id]];
            return _this.setRelated(item, related || null, relatedPath);
        });
    };
    return MorphTo;
}(Relation));
export default MorphTo;
//# sourceMappingURL=MorphTo.js.map