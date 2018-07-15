var ModuleOptions = /** @class */ (function () {
    function ModuleOptions() {
    }
    ModuleOptions.register = function (options) {
        if (options === void 0) { options = {}; }
        if (options.namespace) {
            this.namespace = options.namespace;
        }
        if (options.http) {
            this.defaultHttpConfig = options.http;
        }
        this.check();
    };
    ModuleOptions.check = function () {
        if (!this.defaultHttpConfig) {
            throw new Error('Vuex orm resources: missing default http conf');
        }
        this.checkBaseUrl();
        this.checkHeader();
        this.checkTimeout();
    };
    ModuleOptions.checkBaseUrl = function () {
        if (!this.defaultHttpConfig.baseURL) {
            throw new Error('Vuex orm resources: missing default http baseURL conf');
        }
    };
    ModuleOptions.checkTimeout = function () {
        if (!this.defaultHttpConfig.timeout) {
            throw new Error('Vuex orm resources: missing default http timeout conf');
        }
    };
    ModuleOptions.checkHeader = function () {
        if (!this.defaultHttpConfig.headers) {
            throw new Error('Vuex orm resources: missing default http headers conf');
        }
        if (!this.defaultHttpConfig.headers['Content-Type']) {
            throw new Error('Vuex orm resources: missing default http Content-Type headers conf');
        }
    };
    ModuleOptions.getDefaultHttpConfig = function () {
        return this.defaultHttpConfig;
    };
    ModuleOptions.namespace = 'entities';
    return ModuleOptions;
}());
export default ModuleOptions;
//# sourceMappingURL=Options.js.map