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
import Type from './Type';
var String = /** @class */ (function (_super) {
    __extends(String, _super);
    /**
     * Create a new string instance.
     */
    function String(model, value, mutator) {
        var _this = _super.call(this, model, mutator) /* istanbul ignore next */ || this;
        _this.value = value;
        return _this;
    }
    /**
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    String.prototype.fill = function (value) {
        if (value === undefined) {
            return this.value;
        }
        if (typeof value === 'string') {
            return value;
        }
        return value + '';
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    String.prototype.make = function (value, _parent, key) {
        return this.mutate(this.fill(value), key);
    };
    return String;
}(Type));
export default String;
//# sourceMappingURL=String.js.map