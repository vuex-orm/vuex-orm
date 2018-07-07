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
         * The host/domain of api server
         */
        this.baseUrl = '';
        /**
         * The endpoint of model entity
         */
        this.endpointPath = '';
        /**
         * The methods of model
         */
        this.methods = new Map();
        if (conf) {
            this.baseUrl = conf.baseUrl;
            this.endpointPath = conf.endpointPath;
            if (conf.methods) {
                conf.methods.forEach(function (method) {
                    _this.methods.set(method.name, new MethodConf(method));
                });
            }
        }
    }
    /**
     * Extend a current model's conf with the conf pass
     * @param {JsonModelConf} conf a json model's conf
     */
    ModelConf.prototype.extend = function (conf) {
        var _this = this;
        if (conf.baseUrl) {
            this.baseUrl = conf.baseUrl;
        }
        if (conf.endpointPath) {
            this.endpointPath = conf.endpointPath;
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
        this.http = new HttpConf(http);
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
        this.http = new HttpConf(http);
    };
    return MethodConf;
}());
export { MethodConf };
var HttpConf = /** @class */ (function () {
    /**
     * @constructor
     * @param {HttpConf}
     */
    function HttpConf(_a) {
        var path = _a.path, method = _a.method;
        this.path = path;
        this.method = method;
    }
    /**
     * Bind a path param name with the pass value
     * @param {PathParam[]} params array
     * @return {string} path with bind params
     */
    HttpConf.prototype.bindPathParams = function (params) {
        var _path = clone(this.path);
        params.forEach(function (param) {
            _path = replaceAll(_path, ":" + param.name, param.value);
        });
        return _path;
    };
    return HttpConf;
}());
export { HttpConf };
export var defaultConf = {
    "baseUrl": "http://localhost:3000",
    "endpointPath": "/{self}",
    "methods": [
        {
            "name": "find",
            "alias": ["fetch"],
            "remote": true,
            "localSync": true,
            "http": {
                "path": "",
                "method": "get"
            }
        },
        {
            "name": "findById",
            "alias": ["fetchById"],
            "remote": true,
            "localSync": true,
            "http": {
                "path": "/:id",
                "method": "get"
            }
        },
        {
            "name": "exist",
            "remote": true,
            "http": {
                "path": "/exist/:id",
                "method": "get"
            }
        },
        {
            "name": "count",
            "remote": true,
            "http": {
                "path": "/count",
                "method": "get"
            }
        },
        {
            "name": "create",
            "remote": true,
            "localSync": true,
            "http": {
                "path": "",
                "method": "post"
            }
        },
        {
            "name": "update",
            "remote": true,
            "localSync": true,
            "http": {
                "path": "/:id",
                "method": "put"
            }
        },
        {
            "name": "delete",
            "remote": true,
            "localSync": true,
            "http": {
                "path": "",
                "method": "delete"
            }
        },
        {
            "name": "deleteById",
            "remote": true,
            "localSync": true,
            "http": {
                "path": "/:id",
                "method": "delete"
            }
        }
    ]
};
//# sourceMappingURL=ModelConf.js.map