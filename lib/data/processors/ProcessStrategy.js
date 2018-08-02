var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import Utils from '../../support/Utils';
import Attrs from '../../attributes/contracts/Contract';
import Attribute from '../../attributes/Attribute';
var ProcessStrategy = /** @class */ (function () {
    function ProcessStrategy() {
    }
    /**
     * Create the process strategy.
     */
    ProcessStrategy.create = function (noKey, model, parent, attr) {
        var _this = this;
        return function (value, parentValue, key) {
            var record = __assign({}, value);
            record = _this.fix(record, model);
            record = _this.setId(record, model, noKey, key);
            record = _this.generateMorphFields(record, parentValue, parent, attr);
            return record;
        };
    };
    /**
     * Normalize individual records.
     */
    ProcessStrategy.fix = function (record, model) {
        return this.processFix(record, model.fields());
    };
    /**
     * Normalize individual records.
     */
    ProcessStrategy.processFix = function (record, fields) {
        var _this = this;
        if (record === void 0) { record = {}; }
        var newRecord = {};
        Utils.forOwn(fields, function (field, key) {
            if (record[key] === undefined) {
                return;
            }
            if (field instanceof Attribute) {
                newRecord[key] = field.fill(record[key]);
                return;
            }
            newRecord[key] = _this.processFix(record[key], field);
        });
        return newRecord;
    };
    /**
     * Set id field to the record.
     */
    ProcessStrategy.setId = function (record, model, noKey, key) {
        var id = model.id(record);
        return __assign({}, record, { $id: id !== undefined ? id : noKey.increment(key) });
    };
    /**
     * Generate morph fields. This method will generate fileds needed for the
     * morph fields such as `commentable_id` and `commentable_type`.
     */
    ProcessStrategy.generateMorphFields = function (record, parentValue, parent, attr) {
        var _a;
        if (attr === undefined) {
            return record;
        }
        if (!Attrs.isMorphRelation(attr)) {
            return record;
        }
        if (parent === undefined) {
            return record;
        }
        return __assign((_a = {}, _a[attr.id] = parentValue.$id, _a[attr.type] = parent.entity, _a), record);
    };
    return ProcessStrategy;
}());
export default ProcessStrategy;
//# sourceMappingURL=ProcessStrategy.js.map