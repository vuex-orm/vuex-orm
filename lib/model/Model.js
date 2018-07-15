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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import BaseModel from './BaseModel';
import Http from '../http/Http';
import ModelConf, { MethodConf, defaultConf, PathParam } from '../model/ModelConf';
import ModuleOptions from '../options/Options';
import { replaceAll } from '../support/Utils';
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Configure a model with default conf and extend or override
     * the default configuration with a custom configuration present on
     * model class or on parameter.
     * Priority confs:
     * default -> custom on model class -> custom on conf() parameter
     * @param {parameterConf} parameterConf optionaly a json model's conf
     * @static
     */
    Model.conf = function (parameterConf) {
        var _onModelconf = this._conf;
        // instance default conf
        this._conf = new ModelConf(JSON.parse(replaceAll(JSON.stringify(defaultConf), '{self}', this.entity)));
        // check if confs on model are present
        if (_onModelconf) {
            this._conf.extend(JSON.parse(replaceAll(JSON.stringify(_onModelconf), '{self}', this.entity)));
        }
        // check if confs parameter are present
        if (parameterConf) {
            this._conf.extend(JSON.parse(replaceAll(JSON.stringify(parameterConf), '{self}', this.entity)));
        }
        this._http = new Http(this._conf.http, ModuleOptions.getDefaultHttpConfig());
    };
    /**
     * Fetch data from api server and sync to the local store (optionaly)
     * @param {MethodConf} conf a method's conf
     * @static
     * @async
     * @return {Promise<UpdateReturn>} fetched data
     */
    Model.fetch = function (conf) {
        if (conf === void 0) { conf = this.getMethodConf('fetch'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, url, method, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('fetch', conf);
                        url = this.getUrl(_conf);
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](url, _conf.http)
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        data = (_a.sent()) || [];
                        if (!_conf.localSync) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.dispatch('insertOrUpdate', { data: data })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Wrap find method
     * @param {MethodConf} conf a method's conf
     * @static
     * @async
     * @return {Promise<Collection>} list of results
     */
    Model.find = function (conf) {
        if (conf === void 0) { conf = this.getMethodConf('find'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('find', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetch(conf)];
                    case 1:
                        data = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        data = this.query().all();
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Wrap findById method
     * @param {number} id of record to find
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<Item>} result object
     */
    Model.findById = function (id, conf) {
        if (conf === void 0) { conf = this.getMethodConf('findById'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('findById', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchById(id, conf)];
                    case 1:
                        data = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        data = this.query().find(id);
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Exec a fetchById api method with the default confs
     * or the pass confs and sync to the local store (optionaly)
     * @param {number} id of the fetching record
     * @param {MethodConf} conf a method's conf
     * @static
     * @async
     * @return {Promise<Item>} fetched item
     */
    Model.fetchById = function (id, conf) {
        if (conf === void 0) { conf = this.getMethodConf('fetchById'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, url, method, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('fetchById', conf);
                        url = this.getUrl(_conf, new PathParam('id', id.toString()));
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](url, _conf.http)
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        data = (_a.sent()) || [];
                        if (!_conf.localSync) return [3 /*break*/, 3];
                        // await this.update(data)
                        return [4 /*yield*/, this.dispatch('insertOrUpdate', { data: data })];
                    case 2:
                        // await this.update(data)
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Check if record identified by id param exist
     * @param {number} id of the record to search
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<boolean>} the result
     */
    Model.exist = function (id, conf) {
        if (conf === void 0) { conf = this.getMethodConf('exist'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, data, url, method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('exist', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        url = this.getUrl(_conf, new PathParam('id', id.toString()));
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](url, _conf.http)
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        data = (_a.sent()) || [];
                        return [3 /*break*/, 3];
                    case 2:
                        data = this.query().find(id) !== null;
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Wrap count method
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<Number>} number of element
     */
    Model.count = function (conf) {
        if (conf === void 0) { conf = this.getMethodConf('count'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, data, method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('count', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](this.getUrl(_conf), _conf.http)
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        data = (_a.sent()) || [];
                        return [3 /*break*/, 3];
                    case 2:
                        data = this.query().count();
                        _a.label = 3;
                    case 3: return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Wrap create method
     * @param {Record | Record[]} data to create
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<EntityCollection>} the created data
     */
    Model.create = function (data, conf) {
        if (conf === void 0) { conf = this.getMethodConf('create'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, dataOutput, method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('create', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](this.getUrl(_conf), data, _conf.http)
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        dataOutput = (_a.sent()) || [];
                        if (_conf.localSync) {
                            this.dispatch('insert', { data: dataOutput });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        dataOutput = this.dispatch('create', data);
                        _a.label = 3;
                    case 3: return [2 /*return*/, dataOutput];
                }
            });
        });
    };
    /**
     * Wrap update method
     * @param {number} id of the record to search
     * @param {Record | Record[] | UpdateClosure} data to update
     * @param {MethodConf} conf a method's conf
     * @static
     * @return {Promise<UpdateReturn>} updated data
     */
    Model.update = function (id, data, conf) {
        if (conf === void 0) { conf = this.getMethodConf('update'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, dataOutput, url, method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('update', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        url = this.getUrl(_conf, new PathParam('id', id.toString()));
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](url, data, _conf.http)
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        dataOutput = (_a.sent()) || [];
                        if (_conf.localSync && dataOutput) {
                            this.dispatch('update', {
                                where: id,
                                data: dataOutput
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        dataOutput = this.dispatch('update', {
                            where: id,
                            data: data
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/, dataOutput];
                }
            });
        });
    };
    /**
     * Wrap deleteById method
     * @param id of record to delete
     * @param {MethodConf} conf a method's conf
     * @static
     */
    Model.deleteById = function (id, conf) {
        if (conf === void 0) { conf = this.getMethodConf('deleteById'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, url, method, dataOutput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('deleteById', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        url = this.getUrl(_conf, new PathParam('id', id.toString()));
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](url, _conf.http)
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        dataOutput = (_a.sent()) || [];
                        if (_conf.localSync && dataOutput) {
                            this.dispatch('delete', id);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.dispatch('delete', id);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wrap deleteAll method
     * @param {MethodConf} conf a method's conf
     * @static
     */
    Model.delete = function (conf) {
        if (conf === void 0) { conf = this.getMethodConf('deleteById'); }
        return __awaiter(this, void 0, void 0, function () {
            var _conf, method, dataOutput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _conf = this.checkMethodConf('deleteById', conf);
                        if (!_conf.remote) return [3 /*break*/, 2];
                        method = _conf.http.method;
                        return [4 /*yield*/, this._http[method](this.getUrl(_conf))
                                .catch(function (err) { console.log(err); })];
                    case 1:
                        dataOutput = (_a.sent()) || [];
                        if (_conf.localSync && dataOutput) {
                            this.dispatch('deleteAll', {});
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.dispatch('deleteAll', {});
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wrap query getter
     * @static
     */
    Model.query = function () {
        return this.getters('query')();
    };
    /**
     * Build a url of api from the global configuration
     * of model and optionaly the pass params
     * @param {MethodConf} conf a method's conf
     * @param {PathParam[]} pathParams a method's path params
     * @static
     * @return {string} api's url
     */
    Model.getUrl = function (conf) {
        var pathParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            pathParams[_i - 1] = arguments[_i];
        }
        var methodPath = pathParams.length ?
            conf.bindPathParams(pathParams) : conf.http.url;
        return this._conf.http.url + methodPath;
    };
    /**
     * Check if the method configuration exist and
     * assign the pass method's conf to it
     * Return a new method's configuration
     * @param {string} methodName a method's name
     * @param {ModelConf} conf a method's conf
     * @private
     * @static
     * @return {MethodConf} the new method's configuration
     * @throws Error
     */
    Model.checkMethodConf = function (methodName, conf) {
        var _conf = this._conf;
        var _method = _conf.method(methodName);
        if (conf && _method) {
            _method = new MethodConf(_method);
            _method.assign(conf);
        }
        if (!_method) {
            throw new Error(methodName + " configuration method not found");
        }
        return _method;
    };
    /**
     * Get the model conf
     * @static
     * @return {ModelConf}
     */
    Model.getConf = function () {
        return this._conf;
    };
    /**
     * Get the method conf by name
     * @param {string} methodName The method's name
     * @static
     * @return {MethodConf}
     */
    Model.getMethodConf = function (methodName) {
        return this.getConf().method(methodName);
    };
    return Model;
}(BaseModel));
export default Model;
//# sourceMappingURL=Model.js.map