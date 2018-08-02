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
import Attribute from '../Attribute';
var Relation = /** @class */ (function (_super) {
    __extends(Relation, _super);
    function Relation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Create a new map of the record by given key.
     */
    Relation.prototype.mapRecords = function (records, key) {
        return records.reduce(function (records, record) {
            var _a;
            return __assign({}, records, (_a = {}, _a[record[key]] = record, _a));
        }, {});
    };
    /**
     * Get the path of the related field. It returns path as a dot-separated
     * string something like `settings.accounts`.
     */
    Relation.prototype.relatedPath = function (key, fields, parent) {
        var _this = this;
        var _key = key.split('.')[0];
        var _fields = fields || this.model.fields();
        var path = '';
        Object.keys(_fields).some(function (name) {
            if (name === _key) {
                path = parent ? parent + "." + _key : _key;
                return true;
            }
            var field = _fields[name];
            if (field instanceof Attribute) {
                return false;
            }
            var parentPath = parent ? parent + "." + name : name;
            var nestedPath = _this.relatedPath(_key, field, parentPath);
            if (!nestedPath) {
                return false;
            }
            path = nestedPath;
            return true;
        });
        return path;
    };
    /**
     * Set given related records to the item.
     */
    Relation.prototype.setRelated = function (item, related, path) {
        var paths = path.split('.');
        var length = paths.length - 1;
        var schema = item;
        for (var i = 0; i < length; i++) {
            schema = schema[paths[i]];
        }
        schema[paths[length]] = related;
        return item;
    };
    /**
     * Add constraint to the query.
     */
    Relation.prototype.addConstraint = function (query, relation) {
        var relations = relation.name.split('.');
        if (relations.length !== 1) {
            relations.shift();
            if (relations.length > 1) {
                query.with(relations.join('.'));
            }
            else {
                if (relations[0] === '*') {
                    query.withAll();
                }
                else {
                    for (var _i = 0, _a = relations[0].split('|'); _i < _a.length; _i++) {
                        var relation_1 = _a[_i];
                        query.with(relation_1);
                    }
                }
            }
            return;
        }
        var result = relation.constraint && relation.constraint(query);
        if (typeof result === 'boolean') {
            query.where(function () { return result; });
        }
    };
    return Relation;
}(Attribute));
export default Relation;
//# sourceMappingURL=Relation.js.map