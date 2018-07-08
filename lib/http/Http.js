var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import Axios from 'axios';
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.conf = function (config) {
        this.defaultConf = config;
    };
    Http.registerRequestInterceptor = function (requestInterceptor) {
        Axios.interceptors.request.use(requestInterceptor);
    };
    Http.registerResponseInterceptor = function (responseInterceptor) {
        Axios.interceptors.response.use(responseInterceptor);
    };
    Http.mergeConf = function (config) {
        return __assign({}, this.defaultConf, config);
    };
    Http.head = function (url, config) {
        if (config === void 0) { config = this.defaultConf; }
        this.mergeConf(config);
        return Axios.head(url, config);
    };
    Http.get = function (url, config) {
        if (config === void 0) { config = this.defaultConf; }
        this.mergeConf(config);
        return Axios.get(url, config);
    };
    Http.post = function (url, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = this.defaultConf; }
        this.mergeConf(config);
        return Axios.post(url, data, config);
    };
    Http.patch = function (url, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = this.defaultConf; }
        this.mergeConf(config);
        return Axios.patch(url, data, config);
    };
    Http.put = function (url, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = this.defaultConf; }
        this.mergeConf(config);
        return Axios.put(url, data, config);
    };
    Http.delete = function (url, config) {
        if (config === void 0) { config = this.defaultConf; }
        this.mergeConf(config);
        return Axios.delete(url, config);
    };
    return Http;
}());
export default Http;
//# sourceMappingURL=Http.js.map