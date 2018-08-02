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
var Increment = /** @class */ (function (_super) {
    __extends(Increment, _super);
    function Increment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The initial count to start incrementing.
         */
        _this.value = 1;
        return _this;
    }
    /**
     * Transform given data to the appropriate value. This method will be called
     * during data normalization to fix field that has an incorrect value,
     * or add a missing field with the appropriate default value.
     */
    Increment.prototype.fill = function (value) {
        return typeof value === 'number' ? value : null;
    };
    /**
     * Make value to be set to BaseModel property. This method is used when
     * instantiating a BaseModel or creating a plain object from a BaseModel.
     */
    Increment.prototype.make = function (value, _parent, _key) {
        return typeof value === 'number' ? value : null;
    };
    return Increment;
}(Type));
export default Increment;
//# sourceMappingURL=Increment.js.map