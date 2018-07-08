import Http from '../http/Http';
var ModuleOptions = /** @class */ (function () {
    function ModuleOptions() {
    }
    ModuleOptions.register = function (options) {
        if (options === void 0) { options = {}; }
        if (options.namespace) {
            this.namespace = options.namespace;
        }
        if (options.http) {
            this.http = options.http;
        }
        this.check();
        this.confAxiosModule();
    };
    ModuleOptions.confAxiosModule = function () {
        Http.conf(this.http);
        if (this.http.requestInterceptor) {
            Http.registerRequestInterceptor(this.http.requestInterceptor);
        }
        if (this.http.responseInterceptor) {
            Http.registerResponseInterceptor(this.http.responseInterceptor);
        }
    };
    ModuleOptions.check = function () {
        if (!this.http) {
            throw new Error('Vuex orm resources: missing default http conf');
        }
        this.checkBaseUrl();
        this.checkHeader();
        this.checkTimeout();
    };
    ModuleOptions.checkBaseUrl = function () {
        if (!this.http.baseURL) {
            throw new Error('Vuex orm resources: missing default http baseURL conf');
        }
    };
    ModuleOptions.checkTimeout = function () {
        if (!this.http.timeout) {
            throw new Error('Vuex orm resources: missing default http timeout conf');
        }
    };
    ModuleOptions.checkHeader = function () {
        if (!this.http.headers) {
            throw new Error('Vuex orm resources: missing default http headers conf');
        }
        if (!this.http.headers['Content-Type']) {
            throw new Error('Vuex orm resources: missing default http Content-Type headers conf');
        }
    };
    ModuleOptions.namespace = 'entities';
    return ModuleOptions;
}());
export default ModuleOptions;
//# sourceMappingURL=Options.js.map