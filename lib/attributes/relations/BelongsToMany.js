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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import Utils from '../../support/Utils';
import Query from '../../query/Query';
import Relation from './Relation';
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
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    BelongsToMany.prototype.fill = function (value) {
        return Array.isArray(value) ? value : [];
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    BelongsToMany.prototype.make = function (value, _parent, _key) {
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
    BelongsToMany.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Load the belongs to relationship for the record.
     */
    BelongsToMany.prototype.load = function (query, collection, relation) {
        var _this = this;
        var relatedQuery = new Query(query.rootState, this.related.entity, false);
        this.addConstraint(relatedQuery, relation);
        var relatedRecords = relatedQuery.get();
        var related = relatedRecords.reduce(function (records, record) {
            records[record[_this.relatedKey]] = record;
            return records;
        }, {});
        var pivotRecords = new Query(query.rootState, this.pivot.entity).get();
        var pivots = pivotRecords.reduce(function (records, record) {
            if (!records[record[_this.foreignPivotKey]]) {
                records[record[_this.foreignPivotKey]] = [];
            }
            records[record[_this.foreignPivotKey]].push(related[record[_this.relatedPivotKey]]);
            return records;
        }, {});
        return collection.map(function (item) {
            item[relation.name] = pivots[item[_this.parentKey]];
            return item;
        });
    };
    /**
     * Create pivot records for the given records if needed.
     */
    BelongsToMany.prototype.createPivots = function (parent, data, key) {
        var _this = this;
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
            var pivotKey = record[_this.parentKey] + "_" + id;
            data[_this.pivot.entity] = __assign({}, data[_this.pivot.entity], (_a = {}, _a[pivotKey] = (_b = {
                    $id: pivotKey
                },
                _b[_this.foreignPivotKey] = record[_this.parentKey],
                _b[_this.relatedPivotKey] = id,
                _b), _a));
        });
    };
    return BelongsToMany;
}(Relation));
export default BelongsToMany;
//# sourceMappingURL=BelongsToMany.js.map