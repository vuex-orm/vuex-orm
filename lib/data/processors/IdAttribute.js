var IdAttribute = /** @class */ (function () {
    function IdAttribute() {
    }
    /**
     * Create the id attribute.
     */
    IdAttribute.create = function (noKey, model) {
        return function (value, _parent, key) {
            var id = model.id(value);
            return id !== undefined ? id : noKey.get(key);
        };
    };
    return IdAttribute;
}());
export default IdAttribute;
//# sourceMappingURL=IdAttribute.js.map