var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { replaceAll, clone } from '../support/Utils';
export var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "get";
    HttpMethod["HEAD"] = "head";
    HttpMethod["POST"] = "post";
    HttpMethod["PUT"] = "put";
    HttpMethod["PATCH"] = "patch";
    HttpMethod["DELETE"] = "delete";
})(HttpMethod || (HttpMethod = {}));
var PathParam = /** @class */ (function () {
    function PathParam(name, value) {
        this.value = value;
        this.name = name;
    }
    return PathParam;
}());
export { PathParam };
var ModelConf = /** @class */ (function () {
    /**
     * Create a model's configuration from json
     * @param {JsonModelConf} jsonConfig the json model's configuration
     */
    function ModelConf(conf) {
        var _this = this;
        /**
         * The http config
         */
        this.http = undefined;
        /**
         * The methods of model
         */
        this.methods = new Map();
        if (conf) {
            if (conf.methods) {
                conf.methods.forEach(function (method) {
                    _this.methods.set(method.name, new MethodConf(method));
                });
            }
            if (conf.http) {
                this.http = conf.http;
            }
        }
    }
    /**
     * Extend a current model's conf with the conf pass
     * @param {JsonModelConf} conf a json model's conf
     */
    ModelConf.prototype.extend = function (conf) {
        var _this = this;
        if (conf.http) {
            this.http = __assign({}, this.http, conf.http);
        }
        if (conf.methods && conf.methods.length) {
            conf.methods.forEach(function (method) {
                var _method = _this.methods.get(method.name);
                if (_method) {
                    _method.assign(method);
                }
                /* tslint:disable */
                else {
                    _this.methods.set(method.name, new MethodConf(method));
                }
            });
        }
    };
    /**
     * Get a method by name or alias
     * @param {string} name the method's name to find
     * @return {MethodConf | undefined} return the method fint
     */
    ModelConf.prototype.method = function (name) {
        var _method;
        this.methods.forEach(function (method, key) {
            if ((method.alias && method.alias.indexOf(name) > -1) || key === name) {
                _method = method;
            }
        });
        if (!_method) {
            throw new Error(name + ": method configuration not found");
        }
        return _method;
    };
    /**
     * Add a model method
     * @param name the method name
     * @param method the method conf
     */
    ModelConf.prototype.addMethodConf = function (name, method) {
        this.methods.set(name, method);
    };
    return ModelConf;
}());
export default ModelConf;
var MethodConf = /** @class */ (function () {
    /**
     * Constructor
     * @constructor
     * @param {MethodConf}
     */
    function MethodConf(_a) {
        var name = _a.name, _b = _a.alias, alias = _b === void 0 ? undefined : _b, _c = _a.remote, remote = _c === void 0 ? undefined : _c, _d = _a.localSync, localSync = _d === void 0 ? undefined : _d, http = _a.http;
        this.name = name;
        this.alias = alias;
        this.remote = remote;
        this.localSync = localSync;
        this.http = http;
    }
    /**
     * Assign the new conf for the method
     * @param {MethodConf}
     */
    MethodConf.prototype.assign = function (_a) {
        var _b = _a.name, name = _b === void 0 ? this.name : _b, _c = _a.alias, alias = _c === void 0 ? this.alias : _c, _d = _a.remote, remote = _d === void 0 ? this.remote : _d, _e = _a.localSync, localSync = _e === void 0 ? this.localSync : _e, _f = _a.http, http = _f === void 0 ? this.http : _f;
        this.name = name;
        this.alias = alias;
        this.remote = remote;
        this.localSync = localSync;
        this.http = http;
    };
    /**
     * Bind a path param name with the pass value
     * @param {PathParam[]} params array
     * @return {string} path with bind params
     */
    MethodConf.prototype.bindPathParams = function (params) {
        var _path = "";
        if (this.http && this.http.url) {
            _path = clone(this.http.url);
            params.forEach(function (param) {
                _path = replaceAll(_path, ":" + param.name, param.value);
            });
        }
        return _path;
    };
    return MethodConf;
}());
export { MethodConf };
export var defaultConf = {
    "http": {
        "baseURL": "http://localhost:3000",
        "url": "/{self}",
    },
    "methods": [
        {
            "name": "find",
            "alias": ["fetch"],
            "remote": true,
            "localSync": true,
            "http": {
                "url": "",
                "method": "get"
            }
        },
        {
            "name": "findById",
            "alias": ["fetchById"],
            "remote": true,
            "localSync": true,
            "http": {
                "url": "/:id",
                "method": "get"
            }
        },
        {
            "name": "exist",
            "remote": true,
            "http": {
                "url": "/exist/:id",
                "method": "get"
            }
        },
        {
            "name": "count",
            "remote": true,
            "http": {
                "url": "/count",
                "method": "get"
            }
        },
        {
            "name": "create",
            "remote": true,
            "localSync": true,
            "http": {
                "url": "",
                "method": "post"
            }
        },
        {
            "name": "update",
            "remote": true,
            "localSync": true,
            "http": {
                "url": "/:id",
                "method": "put"
            }
        },
        {
            "name": "delete",
            "remote": true,
            "localSync": true,
            "http": {
                "url": "",
                "method": "delete"
            }
        },
        {
            "name": "deleteById",
            "remote": true,
            "localSync": true,
            "http": {
                "url": "/:id",
                "method": "delete"
            }
        }
    ]
};
//# sourceMappingURL=ModelConf.js.map