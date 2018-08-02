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
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    MorphToMany.prototype.fill = function (value) {
        return Array.isArray(value) ? value : [];
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    MorphToMany.prototype.make = function (value, _parent, _key) {
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
    MorphToMany.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphToMany.prototype.load = function (query, collection, relation) {
        var _this = this;
        var relatedQuery = new Query(query.rootState, this.related.entity, false);
        this.addConstraint(relatedQuery, relation);
        var relatedRecords = relatedQuery.get().reduce(function (records, record) {
            records[record[_this.relatedKey]] = record;
            return records;
        }, {});
        var pivotQuery = new Query(query.rootState, this.pivot.entity, false);
        pivotQuery.where(this.type, query.entity);
        var pivotRecords = pivotQuery.get().reduce(function (records, record) {
            if (!records[record[_this.id]]) {
                records[record[_this.id]] = [];
            }
            records[record[_this.id]].push(relatedRecords[record[_this.relatedId]]);
            return records;
        }, {});
        var relatedPath = this.relatedPath(relation.name);
        return collection.map(function (item) {
            var related = pivotRecords[item[_this.parentKey]];
            return _this.setRelated(item, related || [], relatedPath);
        });
    };
    /**
     * Create pivot records for the given records if needed.
     */
    MorphToMany.prototype.createPivots = function (parent, data) {
        var _this = this;
        Utils.forOwn(data[parent.entity], function (record) {
            var related = record[_this.related.entity];
            if (!Array.isArray(related) || related.length === 0) {
                return;
            }
            _this.createPivotRecord(parent, data, record, related);
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
export default MorphToMany;
//# sourceMappingURL=MorphToMany.js.map