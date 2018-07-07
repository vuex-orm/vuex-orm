var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Http = /** @class */ (function () {
    function Http() {
    }
    Http.request = function (url, _query, _method, _body, _headers, options) {
        if (_body === void 0) { _body = {}; }
        if (_headers === void 0) { _headers = {}; }
        if (options === void 0) { options = {}; }
        var _options = __assign({}, this.defaultOptions, options);
        _options.method = _method;
        if (Object.keys(_body).length) {
            _options.body = JSON.stringify(_body);
        }
        return fetch(url, _options)
            .then(function (response) {
            if (!response.ok) {
                return Promise.reject(new Error('http request failed'));
            }
            else {
                return Promise.resolve(response.json());
            }
        }); // parses response to JSON
    };
    Http.get = function (url, params, headers, options) {
        if (params === void 0) { params = {}; }
        if (headers === void 0) { headers = {}; }
        if (options === void 0) { options = {}; }
        return this.request(url, params, 'GET', {}, headers, options);
    };
    Http.post = function (url, payload, headers, options) {
        if (payload === void 0) { payload = {}; }
        if (headers === void 0) { headers = {}; }
        if (options === void 0) { options = {}; }
        return this.request(url, {}, 'POST', payload, headers, options);
    };
    Http.put = function (url, payload, headers, options) {
        if (payload === void 0) { payload = {}; }
        if (headers === void 0) { headers = {}; }
        if (options === void 0) { options = {}; }
        return this.request(url, {}, 'PUT', payload, headers, options);
    };
    Http.delete = function (url, payload, headers, options) {
        if (payload === void 0) { payload = {}; }
        if (headers === void 0) { headers = {}; }
        if (options === void 0) { options = {}; }
        return this.request(url, {}, 'DELETE', payload, headers, options);
    };
    // Default options are marked with *
    Http.defaultOptions = {
        method: '',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer' // *client, no-referrer
    };
    return Http;
}());
export default Http;
//# sourceMappingURL=Http.js.map