import Utils from '../../support/Utils';
var Incrementer = /** @class */ (function () {
    function Incrementer() {
    }
    /**
     * Increment all fields that have increment attribute.
     */
    Incrementer.process = function (data, query) {
        var _this = this;
        return Utils.mapValues(data, function (records, entity) {
            var newQuery = query.newPlainQuery(entity);
            // If the entity doesn't have increment attribute, do nothing and
            // just return immediately.
            if (!newQuery.model.hasIncrementFields()) {
                return records;
            }
            _this.processRecordsByFields(records, newQuery);
            return records;
        });
    };
    /**
     * Process all of the increment fields.
     */
    Incrementer.processRecordsByFields = function (records, query) {
        var _this = this;
        var fields = query.model.getIncrementFields();
        Utils.forOwn(fields, function (_attr, key) {
            _this.processRecords(records, query, key);
        });
    };
    /**
     * Process all records and increment all field that is defined as increment.
     */
    Incrementer.processRecords = function (records, query, key) {
        var max = this.max(records, query, key);
        Utils.forOwn(records, function (record) {
            if (!record[key]) {
                record[key] = ++max;
            }
        });
    };
    /**
     * Get the max value of the specified field with given data combined
     * with existing records.
     */
    Incrementer.max = function (records, query, field) {
        var maxInState = query.max(field);
        var maxInRecord = Math.max.apply(Math, Utils.map(records, function (record) { return record[field] || 0; }));
        return Math.max(maxInRecord, maxInState);
    };
    return Incrementer;
}());
export default Incrementer;
//# sourceMappingURL=Incrementer.js.map