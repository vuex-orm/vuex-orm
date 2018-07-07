var ModuleOptions = /** @class */ (function () {
    function ModuleOptions() {
    }
    ModuleOptions.register = function (options) {
        if (options === void 0) { options = {}; }
        if (options.namespace) {
            this.namespace = options.namespace;
        }
        if (options.resources) {
            this.resources = options.resources;
        }
    };
    ModuleOptions.namespace = 'entities';
    ModuleOptions.resources = {
        baseUrl: ''
    };
    return ModuleOptions;
}());
export default ModuleOptions;
//# sourceMappingURL=Options.js.map