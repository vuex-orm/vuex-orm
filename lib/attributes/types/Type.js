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
import Attribute from '../Attribute';
var Type = /** @class */ (function (_super) {
    __extends(Type, _super);
    /**
     * Create a new type instance.
     */
    function Type(model, mutator) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.mutator = mutator;
        return _this;
    }
    /**
     * Mutate the given value by mutator.
     */
    Type.prototype.mutate = function (value, key) {
        var mutator = this.mutator || this.model.mutators()[key];
        return mutator ? mutator(value) : value;
    };
    return Type;
}(Attribute));
export default Type;
//# sourceMappingURL=Type.js.map