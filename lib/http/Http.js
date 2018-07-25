import Axios from 'axios';
var Http = /** @class */ (function () {
    function Http(config) {
        var _this = this;
        this.axiosInstance = Axios.create(config);
        if (config.requestInterceptors && Array.isArray(config.requestInterceptors)) {
            config.requestInterceptors.forEach(function (value) {
                _this.axiosInstance.interceptors.request.use(value);
            });
        }
        if (config.responseInterceptors && Array.isArray(config.responseInterceptors)) {
            config.responseInterceptors.forEach(function (value) {
                _this.axiosInstance.interceptors.response.use(value);
            });
        }
    }
    Http.registerRequestInterceptor = function (requestInterceptor) {
        Axios.interceptors.request.use(requestInterceptor);
    };
    Http.registerResponseInterceptor = function (responseInterceptor) {
        Axios.interceptors.response.use(responseInterceptor);
    };
    Http.prototype.request = function (config) {
        return this.axiosInstance.request(config);
    };
    Http.prototype.head = function (url, config) {
        return this.axiosInstance.head(url, config);
    };
    Http.prototype.get = function (url, config) {
        return this.axiosInstance.get(url, config);
    };
    Http.prototype.post = function (url, data, config) {
        if (data === void 0) { data = {}; }
        return this.axiosInstance.post(url, data, config);
    };
    Http.prototype.patch = function (url, data, config) {
        if (data === void 0) { data = {}; }
        return this.axiosInstance.patch(url, data, config);
    };
    Http.prototype.put = function (url, data, config) {
        if (data === void 0) { data = {}; }
        return this.axiosInstance.put(url, data, config);
    };
    Http.prototype.delete = function (url, config) {
        return this.axiosInstance.delete(url, config);
    };
    return Http;
}());
export default Http;
//# sourceMappingURL=Http.js.map