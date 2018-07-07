var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import Utils from '../../support/Utils';
var IdFixer = /** @class */ (function () {
    function IdFixer() {
    }
    /**
     * Fix all of the "no key" records with appropriate id value if it can.
     */
    IdFixer.process = function (data, query) {
        var _this = this;
        return Utils.mapValues(data, function (records, entity) {
            var newQuery = query.newPlainQuery(entity);
            return _this.processRecords(records, newQuery);
        });
    };
    /**
     * Process records to Fix all of the "no key" records with
     * appropriate id value if it can.
     */
    IdFixer.processRecords = function (records, query) {
        return Object.keys(records).reduce(function (newRecords, id) {
            var record = records[id];
            var newId = query.model.id(record);
            var newStringId = isNaN(newId) ? newId : newId.toString();
            if (newId === undefined || id === newStringId) {
                newRecords[id] = record;
                return newRecords;
            }
            newRecords[newStringId] = __assign({}, record, { $id: newId });
            return newRecords;
        }, {});
    };
    return IdFixer;
}());
export default IdFixer;
//# sourceMappingURL=IdFixer.js.map