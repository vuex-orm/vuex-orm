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
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    HasManyThrough.prototype.fill = function (value) {
        return Array.isArray(value) ? value : [];
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    HasManyThrough.prototype.make = function (value, _parent, _key) {
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
    HasManyThrough.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Load the has many through relationship for the record.
     */
    HasManyThrough.prototype.load = function (query, collection, relation) {
        var _this = this;
        var relatedQuery = new Query(query.rootState, this.related.entity, false);
        var relatedRecords = relatedQuery.get().reduce(function (records, record) {
            var key = record[_this.secondKey];
            if (!records[key]) {
                records[key] = [];
            }
            records[key].push(record);
            return records;
        }, {});
        this.addConstraint(relatedQuery, relation);
        var throughQuery = new Query(query.rootState, this.through.entity, false);
        var throughRecords = throughQuery.get().reduce(function (records, record) {
            var key = record[_this.firstKey];
            if (!records[key]) {
                records[key] = [];
            }
            if (relatedRecords[record[_this.secondLocalKey]]) {
                records[key] = records[key].concat(relatedRecords[record[_this.secondLocalKey]]);
            }
            return records;
        }, {});
        var relatedPath = this.relatedPath(relation.name);
        return collection.map(function (item) {
            var related = throughRecords[item[_this.localKey]];
            return _this.setRelated(item, related || [], relatedPath);
        });
    };
    return HasManyThrough;
}(Relation));
export default HasManyThrough;
//# sourceMappingURL=HasManyThrough.js.map