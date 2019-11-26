function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document) && _isObject(document.createElement);
var _domCreate = function (it) {
  return is ? document.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: _core.version,
  mode:  'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var _functionToString = _shared('native-function-to-string', Function.toString);

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid('src');

var TO_STRING = 'toString';
var TPL = ('' + _functionToString).split(TO_STRING);

_core.inspectSource = function (it) {
  return _functionToString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || _functionToString.call(this);
});
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

// https://github.com/tc39/Array.prototype.includes

var $includes = _arrayIncludes(true);

_export(_export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

_addToUnscopables('includes');

var includes = _core.Array.includes;

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.1 Object.assign(target, source, ...)






var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!_descriptors || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign = _core.Object.assign;

var isEnum = _objectPie.f;
var _objectToArray = function (isEntries) {
  return function (it) {
    var O = _toIobject(it);
    var keys = _objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!_descriptors || isEnum.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

// https://github.com/tc39/proposal-object-values-entries

var $entries = _objectToArray(true);

_export(_export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

var entries = _core.Object.entries;

// https://github.com/tc39/proposal-object-values-entries

var $values = _objectToArray(false);

_export(_export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

var values = _core.Object.values;

// 7.2.8 IsRegExp(argument)


var MATCH = _wks('match');
var _isRegexp = function (it) {
  var isRegExp;
  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
};

// helper for String#{startsWith, endsWith, includes}



var _stringContext = function (that, searchString, NAME) {
  if (_isRegexp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(_defined(that));
};

var MATCH$1 = _wks('match');
var _failsIsRegexp = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH$1] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

_export(_export.P + _export.F * _failsIsRegexp(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = _stringContext(this, searchString, STARTS_WITH);
    var index = _toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

var startsWith = _core.String.startsWith;

var Container = /** @class */ (function () {
    function Container() {
    }
    /**
     * Register the database.
     */
    Container.register = function (database) {
        this.database = database;
    };
    return Container;
}());

var install = (function (database, options) {
    if (options === void 0) { options = {}; }
    var namespace = options.namespace || 'entities';
    return function (store) {
        Container.register(database);
        database.start(store, namespace);
    };
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

/**
 * Check if the given array or object is empty.
 */
function isEmpty(data) {
    if (Array.isArray(data)) {
        return data.length === 0;
    }
    return Object.keys(data).length === 0;
}
/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property.
 */
function forOwn(object, iteratee) {
    Object.keys(object).forEach(function (key) { return iteratee(object[key], key, object); });
}
/**
 * Creates an object with the same keys as object and values generated by
 * running each own enumerable string keyed property of object thru
 * iteratee. The iteratee is invoked with three arguments:
 * (value, key, object).
 */
function mapValues(object, iteratee) {
    var newObject = Object.assign({}, object);
    return Object.keys(object).reduce(function (records, key) {
        records[key] = iteratee(object[key], key, object);
        return records;
    }, newObject);
}
/**
 * Creates an object composed of the object properties predicate returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 */
function pickBy(object, predicate) {
    return Object.keys(object).reduce(function (records, key) {
        var value = object[key];
        if (predicate(value, key)) {
            records[key] = value;
        }
        return records;
    }, {});
}
/**
 * Creates an array of elements, sorted in specified order by the results
 * of running each element in a collection thru each iteratee.
 */
function orderBy(collection, keys, directions) {
    var index = -1;
    var result = collection.map(function (value) {
        var criteria = keys.map(function (key) {
            return typeof key === 'function' ? key(value) : value[key];
        });
        return { criteria: criteria, index: ++index, value: value };
    });
    return baseSortBy(result, function (object, other) {
        return compareMultiple(object, other, directions);
    });
}
/**
 * Creates an object composed of keys generated from the results of running
 * each element of collection thru iteratee.
 */
function groupBy(collection, iteratee) {
    return collection.reduce(function (records, record) {
        var key = iteratee(record);
        if (records[key] === undefined) {
            records[key] = [];
        }
        records[key].push(record);
        return records;
    }, {});
}
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their
 * corresponding values.
 */
function baseSortBy(array, comparer) {
    var length = array.length;
    array.sort(comparer);
    while (length--) {
        array[length] = array[length].value;
    }
    return array;
}
/**
 * Used by `orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order.
 * Otherwise, specify an order of "desc" for descending or "asc" for
 * ascending sort order of corresponding values.
 */
function compareMultiple(object, other, orders) {
    var objCriteria = object.criteria;
    var othCriteria = other.criteria;
    var length = objCriteria.length;
    var ordersLength = orders.length;
    var index = -1;
    while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
            if (index >= ordersLength) {
                return result;
            }
            var order = orders[index];
            return result * (order === 'desc' ? -1 : 1);
        }
    }
    return object.index - other.index;
}
/**
 * Compares values to sort them in ascending order.
 */
function compareAscending(value, other) {
    if (value !== other) {
        if (value > other) {
            return 1;
        }
        if (value < other) {
            return -1;
        }
    }
    return 0;
}
var Utils = {
    isEmpty: isEmpty,
    forOwn: forOwn,
    groupBy: groupBy,
    mapValues: mapValues,
    orderBy: orderBy,
    pickBy: pickBy
};

var Attribute = /** @class */ (function () {
    /**
     * Create a new attribute instance.
     */
    function Attribute(model) {
        this.model = model;
    }
    return Attribute;
}());

var Type = /** @class */ (function (_super) {
    __extends(Type, _super);
    /**
     * Create a new type instance.
     */
    function Type(model, value, mutator) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        /**
         * Whether if the attribute can accept `null` as a value.
         */
        _this.isNullable = false;
        _this.value = value;
        _this.mutator = mutator;
        return _this;
    }
    /**
     * Set `isNullable` to be `true`.
     */
    Type.prototype.nullable = function () {
        this.isNullable = true;
        return this;
    };
    /**
     * Mutate the given value by mutator.
     */
    Type.prototype.mutate = function (value, key) {
        var mutator = this.mutator || this.model.mutators()[key];
        return mutator ? mutator(value) : value;
    };
    return Type;
}(Attribute));

var Attr = /** @class */ (function (_super) {
    __extends(Attr, _super);
    /**
     * Create a new attr instance.
     */
    function Attr(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Make value to be set to model property. This method is used when
     * instantiating a model or creating a plain object from a model.
     */
    Attr.prototype.make = function (value, _parent, key) {
        value = value !== undefined ? value : this.value;
        // Default Value might be a function (taking no parameter).
        var localValue = value;
        if (typeof value === 'function') {
            localValue = value();
        }
        return this.mutate(localValue, key);
    };
    return Attr;
}(Type));

var String$1 = /** @class */ (function (_super) {
    __extends(String, _super);
    /**
     * Create a new string instance.
     */
    function String(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    String.prototype.make = function (value, _parent, key) {
        return this.mutate(this.fix(value), key);
    };
    /**
     * Convert given value to the string.
     */
    String.prototype.fix = function (value) {
        if (value === undefined) {
            return this.value;
        }
        if (typeof value === 'string') {
            return value;
        }
        if (value === null && this.isNullable) {
            return value;
        }
        return value + '';
    };
    return String;
}(Type));

var Number = /** @class */ (function (_super) {
    __extends(Number, _super);
    /**
     * Create a new number instance.
     */
    function Number(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    Number.prototype.make = function (value, _parent, key) {
        return this.mutate(this.fix(value), key);
    };
    /**
     * Transform given data to the number.
     */
    Number.prototype.fix = function (value) {
        if (value === undefined) {
            return this.value;
        }
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        }
        if (value === null && this.isNullable) {
            return value;
        }
        return 0;
    };
    return Number;
}(Type));

var Boolean = /** @class */ (function (_super) {
    __extends(Boolean, _super);
    /**
     * Create a new number instance.
     */
    function Boolean(model, value, mutator) {
        /* istanbul ignore next */
        return _super.call(this, model, value, mutator) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    Boolean.prototype.make = function (value, _parent, key) {
        return this.mutate(this.fix(value), key);
    };
    /**
     * Transform given data to the boolean.
     */
    Boolean.prototype.fix = function (value) {
        if (value === undefined) {
            return this.value;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            if (value.length === 0) {
                return false;
            }
            var int = parseInt(value, 0);
            return isNaN(int) ? true : !!int;
        }
        if (typeof value === 'number') {
            return !!value;
        }
        if (value === null && this.isNullable) {
            return value;
        }
        return false;
    };
    return Boolean;
}(Type));

var Uid = /** @class */ (function () {
    function Uid() {
    }
    /**
     * Generate an UUID.
     */
    Uid.make = function () {
        this.count++;
        return "" + this.prefix + this.count;
    };
    /**
     * Reset the count to 0.
     */
    Uid.reset = function () {
        this.count = 0;
    };
    /**
     * Count to create a unique id.
     */
    Uid.count = 0;
    /**
     * Prefix string to be used for the id.
     */
    Uid.prefix = '$uid';
    return Uid;
}());

var Uid$1 = /** @class */ (function (_super) {
    __extends(Uid$1, _super);
    /**
     * Create a new uid instance.
     */
    function Uid$1(model, value) {
        /* istanbul ignore next */
        return _super.call(this, model, value) || this;
    }
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    Uid$1.prototype.make = function (value) {
        if (typeof value === 'number' || typeof value === 'string') {
            return value;
        }
        if (typeof this.value === 'function') {
            return this.value();
        }
        return Uid.make();
    };
    return Uid$1;
}(Type));

var Relation = /** @class */ (function (_super) {
    __extends(Relation, _super);
    function Relation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get relation query instance with constraint attached.
     */
    Relation.prototype.getRelation = function (query, name, constraints) {
        var relation = query.newQuery(name);
        constraints.forEach(function (constraint) { constraint(relation); });
        return relation;
    };
    /**
     * Get specified keys from the given collection.
     */
    Relation.prototype.getKeys = function (collection, key) {
        return collection.reduce(function (models, model) {
            if (model[key] === null || model[key] === undefined) {
                return models;
            }
            models.push(model[key]);
            return models;
        }, []);
    };
    /**
     * Create a new indexed map for the single relation by specified key.
     */
    Relation.prototype.mapSingleRelations = function (collection, key) {
        return collection.reduce(function (records, record) {
            var id = record[key];
            records[id] = record;
            return records;
        }, {});
    };
    /**
     * Create a new indexed map for the many relation by specified key.
     */
    Relation.prototype.mapManyRelations = function (collection, key) {
        return collection.reduce(function (records, record) {
            var id = record[key];
            if (!records[id]) {
                records[id] = [];
            }
            records[id].push(record);
            return records;
        }, {});
    };
    /**
     * Check if the given record is a single relation, which is an object.
     */
    Relation.prototype.isOneRelation = function (record) {
        if (!Array.isArray(record) && record !== null && typeof record === 'object') {
            return true;
        }
        return false;
    };
    /**
     * Check if the given records is a many relation, which is an array
     * of object.
     */
    Relation.prototype.isManyRelation = function (records) {
        if (!Array.isArray(records)) {
            return false;
        }
        if (records.length < 1) {
            return false;
        }
        return true;
    };
    /**
     * Wrap the given object into a model instance.
     */
    Relation.prototype.makeOneRelation = function (record, model) {
        if (!this.isOneRelation(record)) {
            return null;
        }
        var relatedModel = model.getModelFromRecord(record) || model;
        return new relatedModel(record);
    };
    /**
     * Wrap the given records into a collection of model instances.
     */
    Relation.prototype.makeManyRelation = function (records, model) {
        var _this = this;
        if (!this.isManyRelation(records)) {
            return [];
        }
        return records.filter(function (record) {
            return _this.isOneRelation(record);
        }).map(function (record) {
            var relatedModel = model.getModelFromRecord(record) || model;
            return new relatedModel(record);
        });
    };
    return Relation;
}(Attribute));

var HasOne = /** @class */ (function (_super) {
    __extends(HasOne, _super);
    /**
     * Create a new has one instance.
     */
    function HasOne(model, related, foreignKey, localKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.foreignKey = foreignKey;
        _this.localKey = localKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasOne.prototype.define = function (schema) {
        return schema.one(this.related);
    };
    /**
     * Attach the relational key to the related data. For example,
     * when User has one Phone, it will attach value to the
     * `user_id` field of Phone record.
     */
    HasOne.prototype.attach = function (key, record, data) {
        // Check if the record has local key set. If not, set the local key to be
        // the id value. This happens if the user defines the custom local key
        // and didn't include it in the data being normalized.
        if (!record[this.localKey]) {
            record[this.localKey] = this.model.getIndexIdFromRecord(record);
        }
        // Then set the foreign key of the related record if it exists to be the
        // local key of this record.
        var related = data[this.related.entity] && data[this.related.entity][key];
        if (related) {
            related[this.foreignKey] = record[this.localKey];
        }
    };
    /**
     * Make value to be set to model property. This method is used when
     * instantiating a model or creating a plain object from a model.
     */
    HasOne.prototype.make = function (value, _parent, _key) {
        return this.makeOneRelation(value, this.related);
    };
    /**
     * Load the has one relationship for the collection.
     */
    HasOne.prototype.load = function (query, collection, name, constraints) {
        var relation = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraints(relation, collection);
        this.match(collection, relation.get(), name);
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    HasOne.prototype.addEagerConstraints = function (relation, collection) {
        relation.whereFk(this.foreignKey, this.getKeys(collection, this.localKey));
    };
    /**
     * Match the eagerly loaded results to their parents.
     */
    HasOne.prototype.match = function (collection, relations, name) {
        var _this = this;
        var dictionary = this.buildDictionary(relations);
        collection.forEach(function (model) {
            var id = model[_this.localKey];
            var relation = dictionary[id];
            model[name] = relation || null;
        });
    };
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    HasOne.prototype.buildDictionary = function (relations) {
        var _this = this;
        return relations.reduce(function (dictionary, relation) {
            var key = relation[_this.foreignKey];
            dictionary[key] = relation;
            return dictionary;
        }, {});
    };
    return HasOne;
}(Relation));

var BelongsTo = /** @class */ (function (_super) {
    __extends(BelongsTo, _super);
    /**
     * Create a new belongs to instance.
     */
    function BelongsTo(model, parent, foreignKey, ownerKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.parent = _this.model.relation(parent);
        _this.foreignKey = foreignKey;
        _this.ownerKey = ownerKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    BelongsTo.prototype.define = function (schema) {
        return schema.one(this.parent);
    };
    /**
     * Attach the relational key to the given data. For example, when Post
     * belongs to User, it will attach value to the `user_id` field of
     * Post record.
     */
    BelongsTo.prototype.attach = function (key, record, data) {
        // See if the record has the foreign key, if yes, it means the user has
        // provided the key explicitly so do nothing and return.
        if (record[this.foreignKey] !== undefined) {
            return;
        }
        // If there is no foreign key, let's set it here.
        record[this.foreignKey] = data[this.parent.entity] && data[this.parent.entity][key]
            ? data[this.parent.entity][key][this.ownerKey]
            : key;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    BelongsTo.prototype.make = function (value, _parent, _key) {
        return this.makeOneRelation(value, this.parent);
    };
    /**
     * Load the belongs to relationship for the collection.
     */
    BelongsTo.prototype.load = function (query, collection, name, constraints) {
        var relation = this.getRelation(query, this.parent.entity, constraints);
        this.addEagerConstraints(relation, collection);
        this.match(collection, relation.get(), name);
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    BelongsTo.prototype.addEagerConstraints = function (relation, collection) {
        relation.whereFk(this.ownerKey, this.getKeys(collection, this.foreignKey));
    };
    /**
     * Match the eagerly loaded results to their parents.
     */
    BelongsTo.prototype.match = function (collection, relations, name) {
        var _this = this;
        var dictionary = this.buildDictionary(relations);
        collection.forEach(function (model) {
            var id = model[_this.foreignKey];
            var relation = id !== null ? dictionary[id] : null;
            model[name] = relation || null;
        });
    };
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    BelongsTo.prototype.buildDictionary = function (relations) {
        var _this = this;
        return relations.reduce(function (dictionary, relation) {
            var key = relation[_this.ownerKey];
            dictionary[key] = relation;
            return dictionary;
        }, {});
    };
    return BelongsTo;
}(Relation));

var HasMany = /** @class */ (function (_super) {
    __extends(HasMany, _super);
    /**
     * Create a new has many instance.
     */
    function HasMany(model, related, foreignKey, localKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.foreignKey = foreignKey;
        _this.localKey = localKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data.
     */
    HasMany.prototype.attach = function (key, record, data) {
        var _this = this;
        key.forEach(function (index) {
            var related = data[_this.related.entity];
            if (!related || !related[index] || related[index][_this.foreignKey] !== undefined) {
                return;
            }
            related[index][_this.foreignKey] = record[_this.localKey];
        });
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    HasMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the has many relationship for the collection.
     */
    HasMany.prototype.load = function (query, collection, name, constraints) {
        var relation = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraints(relation, collection);
        this.match(collection, relation.get(), name);
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    HasMany.prototype.addEagerConstraints = function (relation, collection) {
        relation.whereFk(this.foreignKey, this.getKeys(collection, this.localKey));
    };
    /**
     * Match the eagerly loaded results to their parents.
     */
    HasMany.prototype.match = function (collection, relations, name) {
        var _this = this;
        var dictionary = this.buildDictionary(relations);
        collection.forEach(function (model) {
            var id = model[_this.localKey];
            var relation = dictionary[id];
            model[name] = relation || [];
        });
    };
    /**
     * Build model dictionary keyed by the relation's foreign key.
     */
    HasMany.prototype.buildDictionary = function (relations) {
        var _this = this;
        return relations.reduce(function (dictionary, relation) {
            var key = relation[_this.foreignKey];
            if (!dictionary[key]) {
                dictionary[key] = [];
            }
            dictionary[key].push(relation);
            return dictionary;
        }, {});
    };
    return HasMany;
}(Relation));

var HasManyBy = /** @class */ (function (_super) {
    __extends(HasManyBy, _super);
    /**
     * Create a new has many by instance.
     */
    function HasManyBy(model, parent, foreignKey, ownerKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.parent = _this.model.relation(parent);
        _this.foreignKey = foreignKey;
        _this.ownerKey = ownerKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasManyBy.prototype.define = function (schema) {
        return schema.many(this.parent);
    };
    /**
     * Attach the relational key to the given data.
     */
    HasManyBy.prototype.attach = function (key, record, _data) {
        var _this = this;
        if (key.length === 0) {
            return;
        }
        record[this.foreignKey] = key.map(function (parentId) {
            return _this.parent.getIdFromRecord(_data[_this.parent.entity][parentId]);
        });
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    HasManyBy.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.parent);
    };
    /**
     * Load the has many by relationship for the collection.
     */
    HasManyBy.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.parent.entity, constraints);
        this.addConstraintForHasManyBy(relatedQuery, collection);
        var relations = this.mapSingleRelations(relatedQuery.get(), this.ownerKey);
        collection.forEach(function (item) {
            var related = _this.getRelatedRecords(relations, item[_this.foreignKey]);
            item[name] = related;
        });
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    HasManyBy.prototype.addConstraintForHasManyBy = function (query, collection) {
        var _this = this;
        var keys = collection.reduce(function (keys, item) {
            return keys.concat(item[_this.foreignKey]);
        }, []);
        query.where(this.ownerKey, keys);
    };
    /**
     * Get related records.
     */
    HasManyBy.prototype.getRelatedRecords = function (records, keys) {
        return keys.reduce(function (items, id) {
            var related = records[id];
            related && items.push(related);
            return items;
        }, []);
    };
    return HasManyBy;
}(Relation));

var HasManyThrough = /** @class */ (function (_super) {
    __extends(HasManyThrough, _super);
    /**
     * Create a new has many through instance.
     */
    function HasManyThrough(model, related, through, firstKey, secondKey, localKey, secondLocalKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.through = _this.model.relation(through);
        _this.firstKey = firstKey;
        _this.secondKey = secondKey;
        _this.localKey = localKey;
        _this.secondLocalKey = secondLocalKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    HasManyThrough.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data. Since has many through
     * relationship doesn't have any foreign key, it would do nothing.
     */
    HasManyThrough.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    HasManyThrough.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the has many through relationship for the collection.
     */
    HasManyThrough.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        var throughQuery = query.newQuery(this.through.entity);
        this.addEagerConstraintForThrough(throughQuery, collection);
        var throughs = throughQuery.get();
        this.addEagerConstraintForRelated(relatedQuery, throughs);
        var relateds = this.mapThroughRelations(throughs, relatedQuery);
        collection.forEach(function (item) {
            var related = relateds[item[_this.localKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for the through relation.
     */
    HasManyThrough.prototype.addEagerConstraintForThrough = function (query, collection) {
        query.where(this.firstKey, this.getKeys(collection, this.localKey));
    };
    /**
     * Set the constraints for the related relation.
     */
    HasManyThrough.prototype.addEagerConstraintForRelated = function (query, collection) {
        query.where(this.secondKey, this.getKeys(collection, this.secondLocalKey));
    };
    /**
     * Create a new indexed map for the through relation.
     */
    HasManyThrough.prototype.mapThroughRelations = function (throughs, relatedQuery) {
        var _this = this;
        var relateds = this.mapManyRelations(relatedQuery.get(), this.secondKey);
        return throughs.reduce(function (records, record) {
            var id = record[_this.firstKey];
            if (!records[id]) {
                records[id] = [];
            }
            var related = relateds[record[_this.secondLocalKey]];
            if (related === undefined) {
                return records;
            }
            records[id] = records[id].concat(related);
            return records;
        }, {});
    };
    return HasManyThrough;
}(Relation));

var BelongsToMany = /** @class */ (function (_super) {
    __extends(BelongsToMany, _super);
    /**
     * Create a new belongs to instance.
     */
    function BelongsToMany(model, related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.pivot = _this.model.relation(pivot);
        _this.foreignPivotKey = foreignPivotKey;
        _this.relatedPivotKey = relatedPivotKey;
        _this.parentKey = parentKey;
        _this.relatedKey = relatedKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    BelongsToMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data. Since belongs to many
     * relationship doesn't have any foreign key, it would do nothing.
     */
    BelongsToMany.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    BelongsToMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the belongs to relationship for the record.
     */
    BelongsToMany.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        var pivotQuery = query.newQuery(this.pivot.entity);
        this.addEagerConstraintForPivot(pivotQuery, collection);
        var pivots = pivotQuery.get();
        this.addEagerConstraintForRelated(relatedQuery, pivots);
        var relateds = this.mapPivotRelations(pivots, relatedQuery);
        collection.forEach(function (item) {
            var related = relateds[item[_this.parentKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for the pivot relation.
     */
    BelongsToMany.prototype.addEagerConstraintForPivot = function (query, collection) {
        query.whereFk(this.foreignPivotKey, this.getKeys(collection, this.parentKey));
    };
    /**
     * Set the constraints for the related relation.
     */
    BelongsToMany.prototype.addEagerConstraintForRelated = function (query, collection) {
        query.whereFk(this.relatedKey, this.getKeys(collection, this.relatedPivotKey));
    };
    /**
     * Create a new indexed map for the pivot relation.
     */
    BelongsToMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
        var _this = this;
        var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
        return pivots.reduce(function (records, record) {
            var id = record[_this.foreignPivotKey];
            if (!records[id]) {
                records[id] = [];
            }
            var related = relateds[record[_this.relatedPivotKey]];
            if (related) {
                records[id] = records[id].concat(related);
            }
            return records;
        }, {});
    };
    /**
     * Create pivot records for the given records if needed.
     */
    BelongsToMany.prototype.createPivots = function (parent, data, key) {
        var _this = this;
        if (this.pivot.primaryKey instanceof Array === false)
            return data;
        Utils.forOwn(data[parent.entity], function (record) {
            var related = record[key];
            if (related === undefined || related.length === 0) {
                return;
            }
            _this.createPivotRecord(data, record, related);
        });
        return data;
    };
    /**
     * Create a pivot record.
     */
    BelongsToMany.prototype.createPivotRecord = function (data, record, related) {
        var _this = this;
        related.forEach(function (id) {
            var _a, _b;
            var parentId = record[_this.parentKey];
            var relatedId = data[_this.related.entity][id][_this.relatedKey];
            var pivotKey = JSON.stringify([relatedId, parentId]);
            var pivotRecord = data[_this.pivot.entity] ? data[_this.pivot.entity][pivotKey] : {};
            data[_this.pivot.entity] = __assign(__assign({}, data[_this.pivot.entity]), (_a = {}, _a[pivotKey] = __assign(__assign({}, pivotRecord), (_b = { $id: pivotKey }, _b[_this.foreignPivotKey] = parentId, _b[_this.relatedPivotKey] = relatedId, _b)), _a));
        });
    };
    return BelongsToMany;
}(Relation));

var MorphTo = /** @class */ (function (_super) {
    __extends(MorphTo, _super);
    /**
     * Create a new morph to instance.
     */
    function MorphTo(model, id, type) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.id = id;
        _this.type = type;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphTo.prototype.define = function (schema) {
        var _this = this;
        return schema.union(function (_value, parentValue) { return parentValue[_this.type]; });
    };
    /**
     * Attach the relational key to the given record. Since morph to
     * relationship doesn't have any foreign key, it would do nothing.
     */
    MorphTo.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphTo.prototype.make = function (value, parent, _key) {
        var related = parent[this.type];
        var model = this.model.relation(related);
        if (!model) {
            return null;
        }
        return this.makeOneRelation(value, model);
    };
    /**
     * Load the morph to relationship for the collection.
     */
    MorphTo.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var types = this.getTypes(collection);
        var relateds = types.reduce(function (relateds, type) {
            var relatedQuery = _this.getRelation(query, type, constraints);
            relateds[type] = _this.mapSingleRelations(relatedQuery.get(), '$id');
            return relateds;
        }, {});
        collection.forEach(function (item) {
            var id = item[_this.id];
            var type = item[_this.type];
            var related = relateds[type][id];
            item[name] = related || null;
        });
    };
    /**
     * Get all types from the collection.
     */
    MorphTo.prototype.getTypes = function (collection) {
        var _this = this;
        return collection.reduce(function (types, item) {
            var type = item[_this.type];
            !types.includes(type) && types.push(type);
            return types;
        }, []);
    };
    return MorphTo;
}(Relation));

var MorphOne = /** @class */ (function (_super) {
    __extends(MorphOne, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphOne(model, related, id, type, localKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.id = id;
        _this.type = type;
        _this.localKey = localKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphOne.prototype.define = function (schema) {
        return schema.one(this.related);
    };
    /**
     * Attach the relational key to the given data.
     */
    MorphOne.prototype.attach = function (key, record, data) {
        var relatedRecord = data[this.related.entity][key];
        relatedRecord[this.id] = relatedRecord[this.id] || this.related.getIdFromRecord(record);
        relatedRecord[this.type] = relatedRecord[this.type] || this.model.entity;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphOne.prototype.make = function (value, _parent, _key) {
        return this.makeOneRelation(value, this.related);
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphOne.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraintForMorphOne(relatedQuery, collection, query.entity);
        var relations = this.mapSingleRelations(relatedQuery.get(), this.id);
        collection.forEach(function (item) {
            var related = relations[item[_this.localKey]];
            item[name] = related || null;
        });
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    MorphOne.prototype.addEagerConstraintForMorphOne = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.localKey));
    };
    return MorphOne;
}(Relation));

var MorphMany = /** @class */ (function (_super) {
    __extends(MorphMany, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphMany(model, related, id, type, localKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.id = id;
        _this.type = type;
        _this.localKey = localKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data.
     */
    MorphMany.prototype.attach = function (key, record, data) {
        var _this = this;
        var relatedItems = data[this.related.entity];
        key.forEach(function (id) {
            var relatedItem = relatedItems[id];
            relatedItem[_this.id] = relatedItem[_this.id] || _this.related.getIdFromRecord(record);
            relatedItem[_this.type] = relatedItem[_this.type] || _this.model.entity;
        });
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphMany.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        this.addEagerConstraintForMorphMany(relatedQuery, collection, query.entity);
        var relations = this.mapManyRelations(relatedQuery.get(), this.id);
        collection.forEach(function (item) {
            var related = relations[item[_this.localKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for an eager load of the relation.
     */
    MorphMany.prototype.addEagerConstraintForMorphMany = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.localKey));
    };
    return MorphMany;
}(Relation));

var MorphToMany = /** @class */ (function (_super) {
    __extends(MorphToMany, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphToMany(model, related, pivot, relatedId, id, type, parentKey, relatedKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.pivot = _this.model.relation(pivot);
        _this.relatedId = relatedId;
        _this.id = id;
        _this.type = type;
        _this.parentKey = parentKey;
        _this.relatedKey = relatedKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphToMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given record. Since morph to many
     * relationship doesn't have any foreign key, it would do nothing.
     */
    MorphToMany.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Convert given value to the appropriate value for the attribute.
     */
    MorphToMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the morph to many relationship for the collection.
     */
    MorphToMany.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        var pivotQuery = query.newQuery(this.pivot.entity);
        this.addEagerConstraintForPivot(pivotQuery, collection, query.entity);
        var pivots = pivotQuery.get();
        this.addEagerConstraintForRelated(relatedQuery, pivots);
        var relateds = this.mapPivotRelations(pivots, relatedQuery);
        collection.forEach(function (item) {
            var related = relateds[item[_this.parentKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for the pivot relation.
     */
    MorphToMany.prototype.addEagerConstraintForPivot = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.id, this.getKeys(collection, this.parentKey));
    };
    /**
     * Set the constraints for the related relation.
     */
    MorphToMany.prototype.addEagerConstraintForRelated = function (query, collection) {
        query.whereFk(this.relatedKey, this.getKeys(collection, this.relatedId));
    };
    /**
     * Create a new indexed map for the pivot relation.
     */
    MorphToMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
        var _this = this;
        var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
        return pivots.reduce(function (records, record) {
            var id = record[_this.id];
            if (!records[id]) {
                records[id] = [];
            }
            var related = relateds[record[_this.relatedId]];
            records[id] = records[id].concat(related);
            return records;
        }, {});
    };
    /**
     * Create pivot records for the given records if needed.
     */
    MorphToMany.prototype.createPivots = function (parent, data, key) {
        var _this = this;
        Utils.forOwn(data[parent.entity], function (record) {
            var relatedIds = parent.query().newQuery(_this.pivot.entity)
                .where(_this.id, record[_this.parentKey])
                .where(_this.type, parent.entity)
                .get();
            var relateds = (record[key] || []).filter(function (relatedId) { return !relatedIds.includes(relatedId); });
            if (!Array.isArray(relateds) || relateds.length === 0) {
                return;
            }
            _this.createPivotRecord(parent, data, record, relateds);
        });
        return data;
    };
    /**
     * Create a pivot record.
     */
    MorphToMany.prototype.createPivotRecord = function (parent, data, record, related) {
        var _this = this;
        related.forEach(function (id) {
            var _a, _b;
            var parentId = record[_this.parentKey];
            var relatedId = data[_this.related.entity][id][_this.relatedKey];
            var pivotKey = parentId + "_" + id + "_" + parent.entity;
            data[_this.pivot.entity] = __assign(__assign({}, data[_this.pivot.entity]), (_a = {}, _a[pivotKey] = (_b = {
                    $id: pivotKey
                },
                _b[_this.relatedId] = relatedId,
                _b[_this.id] = parentId,
                _b[_this.type] = parent.entity,
                _b), _a));
        });
    };
    return MorphToMany;
}(Relation));

var MorphedByMany = /** @class */ (function (_super) {
    __extends(MorphedByMany, _super);
    /**
     * Create a new belongs to instance.
     */
    function MorphedByMany(model, related, pivot, relatedId, id, type, parentKey, relatedKey) {
        var _this = _super.call(this, model) /* istanbul ignore next */ || this;
        _this.related = _this.model.relation(related);
        _this.pivot = _this.model.relation(pivot);
        _this.relatedId = relatedId;
        _this.id = id;
        _this.type = type;
        _this.parentKey = parentKey;
        _this.relatedKey = relatedKey;
        return _this;
    }
    /**
     * Define the normalizr schema for the relationship.
     */
    MorphedByMany.prototype.define = function (schema) {
        return schema.many(this.related);
    };
    /**
     * Attach the relational key to the given data. Since morphed by many
     * relationship doesn't have any foreign key, it would do nothing.
     */
    MorphedByMany.prototype.attach = function (_key, _record, _data) {
        return;
    };
    /**
     * Make value to be set to model property. This method is used when
     * instantiating a model or creating a plain object from a model.
     */
    MorphedByMany.prototype.make = function (value, _parent, _key) {
        return this.makeManyRelation(value, this.related);
    };
    /**
     * Load the morph many relationship for the record.
     */
    MorphedByMany.prototype.load = function (query, collection, name, constraints) {
        var _this = this;
        var relatedQuery = this.getRelation(query, this.related.entity, constraints);
        var pivotQuery = query.newQuery(this.pivot.entity);
        this.addEagerConstraintForPivot(pivotQuery, collection, this.related.entity);
        var pivots = pivotQuery.get();
        this.addEagerConstraintForRelated(relatedQuery, pivots);
        var relateds = this.mapPivotRelations(pivots, relatedQuery);
        collection.forEach(function (item) {
            var related = relateds[item[_this.parentKey]];
            item[name] = related || [];
        });
    };
    /**
     * Set the constraints for the pivot relation.
     */
    MorphedByMany.prototype.addEagerConstraintForPivot = function (query, collection, type) {
        query.whereFk(this.type, type).whereFk(this.relatedId, this.getKeys(collection, this.parentKey));
    };
    /**
     * Set the constraints for the related relation.
     */
    MorphedByMany.prototype.addEagerConstraintForRelated = function (query, collection) {
        query.whereFk(this.relatedKey, this.getKeys(collection, this.id));
    };
    /**
     * Create a new indexed map for the pivot relation.
     */
    MorphedByMany.prototype.mapPivotRelations = function (pivots, relatedQuery) {
        var _this = this;
        var relateds = this.mapManyRelations(relatedQuery.get(), this.relatedKey);
        return pivots.reduce(function (records, record) {
            var id = record[_this.relatedId];
            if (!records[id]) {
                records[id] = [];
            }
            var related = relateds[record[_this.id]];
            records[id] = records[id].concat(related);
            return records;
        }, {});
    };
    /**
     * Create pivot records for the given records if needed.
     */
    MorphedByMany.prototype.createPivots = function (parent, data, key) {
        var _this = this;
        Utils.forOwn(data[parent.entity], function (record) {
            var related = record[key];
            if (!Array.isArray(related)) {
                return;
            }
            _this.createPivotRecord(data, record, related);
        });
        return data;
    };
    /**
     * Create a pivot record.
     */
    MorphedByMany.prototype.createPivotRecord = function (data, record, related) {
        var _this = this;
        related.forEach(function (id) {
            var _a, _b;
            var parentId = record[_this.parentKey];
            var pivotKey = id + "_" + parentId + "_" + _this.related.entity;
            data[_this.pivot.entity] = __assign(__assign({}, data[_this.pivot.entity]), (_a = {}, _a[pivotKey] = (_b = {
                    $id: pivotKey
                },
                _b[_this.relatedId] = parentId,
                _b[_this.id] = _this.model.getIdFromRecord(data[_this.related.entity][id]),
                _b[_this.type] = _this.related.entity,
                _b), _a));
        });
    };
    return MorphedByMany;
}(Relation));

var Serializer = /** @class */ (function () {
    function Serializer() {
    }
    /**
     * Serialize given model fields value to json.
     */
    Serializer.serialize = function (model) {
        var _this = this;
        var keys = Object.keys(model.$fields());
        return keys.reduce(function (record, key) {
            var value = model[key];
            record[key] = _this.serializeValue(value);
            return record;
        }, {});
    };
    /**
     * Serialize given value.
     */
    Serializer.serializeValue = function (value) {
        if (value instanceof Model) {
            return this.serializeItem(value);
        }
        if (Array.isArray(value)) {
            return this.serializeCollection(value);
        }
        return value;
    };
    /**
     * Serialize an item into json.
     */
    Serializer.serializeItem = function (item) {
        return item.$toJson();
    };
    /**
     * Serialize a collection into json.
     */
    Serializer.serializeCollection = function (collection) {
        return collection.map(function (item) {
            if (item instanceof Model) {
                return item.$toJson();
            }
            return item;
        });
    };
    return Serializer;
}());

var Model = /** @class */ (function () {
    /**
     * Create a new model instance.
     */
    function Model(record) {
        /**
         * The index ID for the model.
         */
        this.$id = null;
        this.$fill(record);
    }
    /**
     * The definition of the fields of the model and its relations.
     */
    Model.fields = function () {
        return {};
    };
    /**
     * Create an attr attribute.
     */
    Model.attr = function (value, mutator) {
        return new Attr(this, value, mutator);
    };
    /**
     * Create a string attribute.
     */
    Model.string = function (value, mutator) {
        return new String$1(this, value, mutator);
    };
    /**
     * Create a number attribute.
     */
    Model.number = function (value, mutator) {
        return new Number(this, value, mutator);
    };
    /**
     * Create a boolean attribute.
     */
    Model.boolean = function (value, mutator) {
        return new Boolean(this, value, mutator);
    };
    /**
     * Create an uid attribute.
     */
    Model.uid = function (value) {
        return new Uid$1(this, value);
    };
    /**
     * @deprecated Use `uid` attribute instead.
     */
    Model.increment = function () {
        return this.uid();
    };
    /**
     * Create a has one relationship.
     */
    Model.hasOne = function (related, foreignKey, localKey) {
        return new HasOne(this, related, foreignKey, this.localKey(localKey));
    };
    /**
     * Create a belongs to relationship.
     */
    Model.belongsTo = function (parent, foreignKey, ownerKey) {
        return new BelongsTo(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
    };
    /**
     * Create a has many relationship.
     */
    Model.hasMany = function (related, foreignKey, localKey) {
        return new HasMany(this, related, foreignKey, this.localKey(localKey));
    };
    /**
     * Create a has many by relationship.
     */
    Model.hasManyBy = function (parent, foreignKey, ownerKey) {
        return new HasManyBy(this, parent, foreignKey, this.relation(parent).localKey(ownerKey));
    };
    /**
     * Create a has many through relationship.
     */
    Model.hasManyThrough = function (related, through, firstKey, secondKey, localKey, secondLocalKey) {
        return new HasManyThrough(this, related, through, firstKey, secondKey, this.localKey(localKey), this.relation(through).localKey(secondLocalKey));
    };
    /**
     * Create a belongs to many relationship.
     */
    Model.belongsToMany = function (related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
        return new BelongsToMany(this, related, pivot, foreignPivotKey, relatedPivotKey, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Create a morph to relationship.
     */
    Model.morphTo = function (id, type) {
        return new MorphTo(this, id, type);
    };
    /**
     * Create a morph one relationship.
     */
    Model.morphOne = function (related, id, type, localKey) {
        return new MorphOne(this, related, id, type, this.localKey(localKey));
    };
    /**
     * Create a morph many relationship.
     */
    Model.morphMany = function (related, id, type, localKey) {
        return new MorphMany(this, related, id, type, this.localKey(localKey));
    };
    /**
     * Create a morph to many relationship.
     */
    Model.morphToMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
        return new MorphToMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Create a morphed by many relationship.
     */
    Model.morphedByMany = function (related, pivot, relatedId, id, type, parentKey, relatedKey) {
        return new MorphedByMany(this, related, pivot, relatedId, id, type, this.localKey(parentKey), this.relation(related).localKey(relatedKey));
    };
    /**
     * Mutators to mutate matching fields when instantiating the model.
     */
    Model.mutators = function () {
        return {};
    };
    /**
     * Types mapping used to dispatch entities based on their discriminator field
     */
    Model.types = function () {
        return {};
    };
    /**
     * Get the database instance from the container.
     */
    Model.database = function () {
        return Container.database;
    };
    /**
     * Get the store instance from the container.
     */
    Model.store = function () {
        return this.database().store;
    };
    /**
     * Create a namespaced method name for Vuex Module from the given
     * method name.
     */
    Model.namespace = function (method) {
        return this.database().namespace + "/" + this.entity + "/" + method;
    };
    /**
     * Call Vuex Getters.
     */
    Model.getters = function (method) {
        return this.store().getters[this.namespace(method)];
    };
    /**
     * Dispatch Vuex Action.
     */
    Model.dispatch = function (method, payload) {
        return this.store().dispatch(this.namespace(method), payload);
    };
    /**
     * Commit Vuex Mutation.
     */
    Model.commit = function (callback) {
        this.store().commit(this.database().namespace + "/$mutate", {
            entity: this.entity,
            callback: callback
        });
    };
    /**
     * Get the Model schema definition from the cache.
     */
    Model.getFields = function () {
        if (!this.cachedFields) {
            this.cachedFields = {};
        }
        if (this.cachedFields[this.entity]) {
            return this.cachedFields[this.entity];
        }
        this.cachedFields[this.entity] = __assign({ $id: this.string(null).nullable() }, this.fields());
        return this.cachedFields[this.entity];
    };
    /**
     * Get all records.
     */
    Model.all = function () {
        return this.getters('all')();
    };
    /**
     * Find a record.
     */
    Model.find = function (id) {
        return this.getters('find')(id);
    };
    /**
     * Get the record of the given array of ids.
     */
    Model.findIn = function (idList) {
        return this.getters('findIn')(idList);
    };
    /**
     * Get query instance.
     */
    Model.query = function () {
        return this.getters('query')();
    };
    /**
     * Create new data with all fields filled by default values.
     */
    Model.new = function () {
        return this.dispatch('new');
    };
    /**
     * Save given data to the store by replacing all existing records in the
     * store. If you want to save data without replacing existing records,
     * use the `insert` method instead.
     */
    Model.create = function (payload) {
        return this.dispatch('create', payload);
    };
    /**
     * Insert records.
     */
    Model.insert = function (payload) {
        return this.dispatch('insert', payload);
    };
    /**
     * Update records.
     */
    Model.update = function (payload) {
        return this.dispatch('update', payload);
    };
    /**
     * Insert or update records.
     */
    Model.insertOrUpdate = function (payload) {
        return this.dispatch('insertOrUpdate', payload);
    };
    Model.delete = function (payload) {
        return this.dispatch('delete', payload);
    };
    /**
     * Delete all records from the store.
     */
    Model.deleteAll = function () {
        return this.dispatch('deleteAll');
    };
    /**
     * Check if the given key is the primary key. If the model has composite
     * primary key, this method is going to check if the given key is included
     * in the composite key.
     */
    Model.isPrimaryKey = function (key) {
        if (!Array.isArray(this.primaryKey)) {
            return this.primaryKey === key;
        }
        return this.primaryKey.includes(key);
    };
    /**
     * Get the id (value of primary key) from teh given record. If primary key is
     * not present, or it is invalid primary key value, which is other than
     * `string` or `number`, it's going to return `null`.
     *
     * If the model has composite key, it's going to return array of ids. If any
     * composite key missing, it will return `null`.
     */
    Model.getIdFromRecord = function (record) {
        var _this = this;
        var key = this.primaryKey;
        if (typeof key === 'string') {
            return this.getIdFromValue(record[key]);
        }
        var ids = key.reduce(function (keys, k) {
            var id = _this.getIdFromValue(record[k]);
            id !== null && keys.push(id);
            return keys;
        }, []);
        return ids.length === key.length ? ids : null;
    };
    /**
     * Get correct index id, which is `string` | `number`, from the given value.
     */
    Model.getIdFromValue = function (value) {
        if (typeof value === 'string' && value !== '') {
            return value;
        }
        if (typeof value === 'number') {
            return value;
        }
        return null;
    };
    /**
     * Get the index ID value from the given record. An index ID is a value that
     * used as a key for records within the Vuex Store.
     *
     * Most of the time, it's same as the value for the Model's primary key but
     * it's always `string`, even if the primary key value is `number`.
     *
     * If the Model has a composite primary key, each value corresponding to
     * those primary key will be stringified and become a single string value
     * such as `'[1,2]'`.
     *
     * If the primary key is not present at the given record, it returns `null`.
     * For the composite primary key, every key must exist at a given record,
     * or it will return `null`.
     */
    Model.getIndexIdFromRecord = function (record) {
        var id = this.getIdFromRecord(record);
        if (id === null) {
            return null;
        }
        if (Array.isArray(id)) {
            return JSON.stringify(id);
        }
        return String(id);
    };
    /**
     * Get local key to pass to the attributes.
     */
    Model.localKey = function (key) {
        if (key) {
            return key;
        }
        return typeof this.primaryKey === 'string' ? this.primaryKey : 'id';
    };
    /**
     * Get the model object that matches the given record type. The method is for
     * getting the correct model object when the model has any inheritance
     * children model.
     *
     * For example, if a User Model have `static types()` declared, and if you
     * pass record with `{ type: 'admin' }`, then the method will likely to
     * return SuperUser class.
     */
    Model.getModelFromRecord = function (record) {
        // If the given record is already a model instance, return the
        // model object.
        if (record instanceof this) {
            return record.$self();
        }
        // Else, get the corresponding model for the type value if there's any.
        return this.getTypeModel(record[this.typeKey]);
    };
    /**
     * Get a model from the container.
     */
    Model.relation = function (model) {
        if (typeof model !== 'string') {
            return model;
        }
        return this.database().model(model);
    };
    /**
     * Get all `belongsToMany` fields from the schema.
     */
    Model.pivotFields = function () {
        var fields = [];
        Utils.forOwn(this.getFields(), function (field, key) {
            var _a;
            if (field instanceof BelongsToMany || field instanceof MorphToMany || field instanceof MorphedByMany) {
                fields.push((_a = {}, _a[key] = field, _a));
            }
        });
        return fields;
    };
    /**
     * Check if fields contains the `belongsToMany` field type.
     */
    Model.hasPivotFields = function () {
        return this.pivotFields().length > 0;
    };
    /**
     * Check if the current model has a type definition
     */
    Model.hasTypes = function () {
        return Object.keys(this.types()).length > 0;
    };
    /**
     * Get the model corresponding to the given type name. If it can't be found,
     * it'll return `null`.
     */
    Model.getTypeModel = function (name) {
        return this.types()[name] || null;
    };
    /**
     * Given a Model, this returns the corresponding key in the InheritanceTypes mapping
     */
    Model.getTypeKeyValueFromModel = function (model) {
        var modelToCheck = model || this;
        var types = this.types();
        for (var type in types) {
            if (types[type] === modelToCheck) {
                return type;
            }
        }
        return null;
    };
    /**
     * Tries to find a Relation field in all types defined in the InheritanceTypes mapping
     */
    Model.findRelationInSubTypes = function (relationName) {
        var types = this.types();
        for (var type in types) {
            var fields = types[type].getFields();
            for (var fieldName in fields) {
                if (fieldName === relationName && fields[fieldName] instanceof Relation) {
                    return fields[fieldName];
                }
            }
        }
        return null;
    };
    /**
     * Fill any missing fields in the given record with the default value defined
     * in the model schema.
     */
    Model.hydrate = function (record) {
        return (new this(record)).$toJson();
    };
    /**
     * Get the constructor of this model.
     */
    Model.prototype.$self = function () {
        return this.constructor;
    };
    /**
     * Get the primary key for the model.
     */
    Model.prototype.$primaryKey = function () {
        return this.$self().primaryKey;
    };
    /**
     * The definition of the fields of the model and its relations.
     */
    Model.prototype.$fields = function () {
        return this.$self().getFields();
    };
    /**
     * Get the store instance from the container.
     */
    Model.prototype.$store = function () {
        return this.$self().store();
    };
    /**
     * Create a namespaced method name for Vuex Module from the given
     * method name.
     */
    Model.prototype.$namespace = function (method) {
        return this.$self().namespace(method);
    };
    /**
     * Call Vuex Getetrs.
     */
    Model.prototype.$getters = function (method) {
        return this.$self().getters(method);
    };
    /**
     * Dispatch Vuex Action.
     */
    Model.prototype.$dispatch = function (method, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$self().dispatch(method, payload)];
            });
        });
    };
    /**
     * Get all records.
     */
    Model.prototype.$all = function () {
        return this.$getters('all')();
    };
    /**
     * Find a record.
     */
    Model.prototype.$find = function (id) {
        return this.$getters('find')(id);
    };
    /**
     * Find record of the given array of ids.
     */
    Model.prototype.$findIn = function (idList) {
        return this.$getters('findIn')(idList);
    };
    /**
     * Get query instance.
     */
    Model.prototype.$query = function () {
        return this.$getters('query')();
    };
    /**
     * Create records.
     */
    Model.prototype.$create = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('create', payload)];
            });
        });
    };
    /**
     * Create records.
     */
    Model.prototype.$insert = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('insert', payload)];
            });
        });
    };
    /**
     * Update records.
     */
    Model.prototype.$update = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (Array.isArray(payload)) {
                    return [2 /*return*/, this.$dispatch('update', payload)];
                }
                if (payload.where !== undefined) {
                    return [2 /*return*/, this.$dispatch('update', payload)];
                }
                if (this.$self().getIndexIdFromRecord(payload) === null) {
                    return [2 /*return*/, this.$dispatch('update', { where: this.$id, data: payload })];
                }
                return [2 /*return*/, this.$dispatch('update', payload)];
            });
        });
    };
    /**
     * Insert or update records.
     */
    Model.prototype.$insertOrUpdate = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('insertOrUpdate', payload)];
            });
        });
    };
    /**
     * Save record.
     */
    Model.prototype.$save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fields, record, records;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fields = this.$self().getFields();
                        record = Object.keys(fields).reduce(function (record, key) {
                            if (fields[key] instanceof Type) {
                                record[key] = _this[key];
                            }
                            return record;
                        }, {});
                        return [4 /*yield*/, this.$dispatch('insertOrUpdate', { data: record })];
                    case 1:
                        records = _a.sent();
                        this.$fill(records[this.$self().entity][0]);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Delete records that matches the given condition.
     */
    Model.prototype.$delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var primaryKey;
            var _this = this;
            return __generator(this, function (_a) {
                primaryKey = this.$primaryKey();
                if (!Array.isArray(primaryKey)) {
                    return [2 /*return*/, this.$dispatch('delete', this[primaryKey])];
                }
                return [2 /*return*/, this.$dispatch('delete', function (model) {
                        return primaryKey.every(function (id) { return model[id] === _this[id]; });
                    })];
            });
        });
    };
    /**
     * Delete all records.
     */
    Model.prototype.$deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.$dispatch('deleteAll')];
            });
        });
    };
    /**
     * Fill the model instance with the given record. If no record were passed,
     * or if the record has any missing fields, each value of the fields will
     * be filled with its default value defined at model fields definition.
     */
    Model.prototype.$fill = function (record) {
        var data = record || {};
        var fields = this.$fields();
        for (var key in fields) {
            var field = fields[key];
            var value = data[key];
            this[key] = field.make(value, data, key);
        }
    };
    /**
     * Serialize field values into json.
     */
    Model.prototype.$toJson = function () {
        return Serializer.serialize(this);
    };
    /**
     * The primary key to be used for the model.
     */
    Model.primaryKey = 'id';
    /**
     * The discriminator key to be used for the model when inheritance is used
     */
    Model.typeKey = 'type';
    /**
     * Vuex Store state definition.
     */
    Model.state = {};
    return Model;
}());

var Getters = {
    /**
     * Create a new Query instance.
     */
    query: function (state, _getters, _rootState, rootGetters) { return function () {
        return rootGetters[state.$connection + "/query"](state.$name);
    }; },
    /**
     * Get all data of given entity.
     */
    all: function (state, _getters, _rootState, rootGetters) { return function () {
        return rootGetters[state.$connection + "/all"](state.$name);
    }; },
    /**
     * Find a data of the given entity by given id.
     */
    find: function (state, _getters, _rootState, rootGetters) { return function (id) {
        return rootGetters[state.$connection + "/find"](state.$name, id);
    }; },
    /**
     * Find array of data of the given entity by given ids.
     */
    findIn: function (state, _getters, _rootState, rootGetters) { return function (idList) {
        return rootGetters[state.$connection + "/findIn"](state.$name, idList);
    }; }
};

function destroy(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity, where;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            where = payload;
            return [2 /*return*/, context.dispatch(state.$connection + "/delete", { entity: entity, where: where }, { root: true })];
        });
    });
}
/**
 * Delete all data from the store.
 */
function deleteAll(context) {
    return __awaiter(this, void 0, void 0, function () {
        var state, entity;
        return __generator(this, function (_a) {
            state = context.state;
            entity = state.$name;
            return [2 /*return*/, context.dispatch(state.$connection + "/deleteAll", { entity: entity }, { root: true })];
        });
    });
}
var Actions = {
    /**
     * Create new data with all fields filled by default values.
     */
    new: function (context) {
        var state = context.state;
        var entity = state.$name;
        return context.dispatch(state.$connection + "/new", { entity: entity }, { root: true });
    },
    /**
     * Save given data to the store by replacing all existing records in the
     * store. If you want to save data without replacing existing records,
     * use the `insert` method instead.
     */
    create: function (context, payload) {
        var state = context.state;
        var entity = state.$name;
        return context.dispatch(state.$connection + "/create", __assign(__assign({}, payload), { entity: entity }), { root: true });
    },
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    insert: function (context, payload) {
        var state = context.state;
        var entity = state.$name;
        return context.dispatch(state.$connection + "/insert", __assign(__assign({}, payload), { entity: entity }), { root: true });
    },
    /**
     * Update data in the store.
     */
    update: function (context, payload) {
        var state = context.state;
        var entity = state.$name;
        // If the payload is an array, then the payload should be an array of
        // data so let's pass the whole payload as data.
        if (Array.isArray(payload)) {
            return context.dispatch(state.$connection + "/update", { entity: entity, data: payload }, { root: true });
        }
        // If the payload doesn't have `data` property, we'll assume that
        // the user has passed the object as the payload so let's define
        // the whole payload as a data.
        if (payload.data === undefined) {
            return context.dispatch(state.$connection + "/update", { entity: entity, data: payload }, { root: true });
        }
        // Else destructure the payload and let root action handle it.
        return context.dispatch(state.$connection + "/update", __assign({ entity: entity }, payload), { root: true });
    },
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    insertOrUpdate: function (context, payload) {
        var state = context.state;
        var entity = state.$name;
        return context.dispatch(state.$connection + "/insertOrUpdate", __assign({ entity: entity }, payload), { root: true });
    },
    delete: destroy,
    deleteAll: deleteAll
};

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/**
 * Helpers to enable Immutable compatibility *without* bringing in
 * the 'immutable' package as a dependency.
 */

/**
 * Check if an object is immutable by checking if it has a key specific
 * to the immutable library.
 *
 * @param  {any} object
 * @return {bool}
 */
function isImmutable(object) {
  return !!(object && typeof object.hasOwnProperty === 'function' && (object.hasOwnProperty('__ownerID') || // Immutable.Map
  object._map && object._map.hasOwnProperty('__ownerID'))); // Immutable.Record
}
/**
 * Denormalize an immutable entity.
 *
 * @param  {Schema} schema
 * @param  {Immutable.Map|Immutable.Record} input
 * @param  {function} unvisit
 * @param  {function} getDenormalizedEntity
 * @return {Immutable.Map|Immutable.Record}
 */

function denormalizeImmutable(schema, input, unvisit) {
  return Object.keys(schema).reduce(function (object, key) {
    // Immutable maps cast keys to strings on write so we need to ensure
    // we're accessing them using string keys.
    var stringKey = "" + key;

    if (object.has(stringKey)) {
      return object.set(stringKey, unvisit(object.get(stringKey), schema[stringKey]));
    } else {
      return object;
    }
  }, input);
}

var getDefaultGetId = function getDefaultGetId(idAttribute) {
  return function (input) {
    return isImmutable(input) ? input.get(idAttribute) : input[idAttribute];
  };
};

var EntitySchema =
/*#__PURE__*/
function () {
  function EntitySchema(key, definition, options) {
    if (definition === void 0) {
      definition = {};
    }

    if (options === void 0) {
      options = {};
    }

    if (!key || typeof key !== 'string') {
      throw new Error("Expected a string key for Entity, but found " + key + ".");
    }

    var _options = options,
        _options$idAttribute = _options.idAttribute,
        idAttribute = _options$idAttribute === void 0 ? 'id' : _options$idAttribute,
        _options$mergeStrateg = _options.mergeStrategy,
        mergeStrategy = _options$mergeStrateg === void 0 ? function (entityA, entityB) {
      return _objectSpread({}, entityA, entityB);
    } : _options$mergeStrateg,
        _options$processStrat = _options.processStrategy,
        processStrategy = _options$processStrat === void 0 ? function (input) {
      return _objectSpread({}, input);
    } : _options$processStrat;
    this._key = key;
    this._getId = typeof idAttribute === 'function' ? idAttribute : getDefaultGetId(idAttribute);
    this._idAttribute = idAttribute;
    this._mergeStrategy = mergeStrategy;
    this._processStrategy = processStrategy;
    this.define(definition);
  }

  var _proto = EntitySchema.prototype;

  _proto.define = function define(definition) {
    this.schema = Object.keys(definition).reduce(function (entitySchema, key) {
      var _objectSpread2;

      var schema = definition[key];
      return _objectSpread({}, entitySchema, (_objectSpread2 = {}, _objectSpread2[key] = schema, _objectSpread2));
    }, this.schema || {});
  };

  _proto.getId = function getId(input, parent, key) {
    return this._getId(input, parent, key);
  };

  _proto.merge = function merge(entityA, entityB) {
    return this._mergeStrategy(entityA, entityB);
  };

  _proto.normalize = function normalize(input, parent, key, visit, addEntity, visitedEntities) {
    var _this = this;

    if (visitedEntities.some(function (entity) {
      return entity === input;
    })) {
      return this.getId(input, parent, key);
    }

    visitedEntities.push(input);

    var processedEntity = this._processStrategy(input, parent, key);

    Object.keys(this.schema).forEach(function (key) {
      if (processedEntity.hasOwnProperty(key) && typeof processedEntity[key] === 'object') {
        var schema = _this.schema[key];
        processedEntity[key] = visit(processedEntity[key], processedEntity, key, schema, addEntity, visitedEntities);
      }
    });
    addEntity(this, processedEntity, input, parent, key);
    return this.getId(input, parent, key);
  };

  _proto.denormalize = function denormalize(entity, unvisit) {
    var _this2 = this;

    if (isImmutable(entity)) {
      return denormalizeImmutable(this.schema, entity, unvisit);
    }

    Object.keys(this.schema).forEach(function (key) {
      if (entity.hasOwnProperty(key)) {
        var schema = _this2.schema[key];
        entity[key] = unvisit(entity[key], schema);
      }
    });
    return entity;
  };

  _createClass(EntitySchema, [{
    key: "key",
    get: function get() {
      return this._key;
    }
  }, {
    key: "idAttribute",
    get: function get() {
      return this._idAttribute;
    }
  }]);

  return EntitySchema;
}();

var PolymorphicSchema =
/*#__PURE__*/
function () {
  function PolymorphicSchema(definition, schemaAttribute) {
    if (schemaAttribute) {
      this._schemaAttribute = typeof schemaAttribute === 'string' ? function (input) {
        return input[schemaAttribute];
      } : schemaAttribute;
    }

    this.define(definition);
  }

  var _proto = PolymorphicSchema.prototype;

  _proto.define = function define(definition) {
    this.schema = definition;
  };

  _proto.getSchemaAttribute = function getSchemaAttribute(input, parent, key) {
    return !this.isSingleSchema && this._schemaAttribute(input, parent, key);
  };

  _proto.inferSchema = function inferSchema(input, parent, key) {
    if (this.isSingleSchema) {
      return this.schema;
    }

    var attr = this.getSchemaAttribute(input, parent, key);
    return this.schema[attr];
  };

  _proto.normalizeValue = function normalizeValue(value, parent, key, visit, addEntity, visitedEntities) {
    var schema = this.inferSchema(value, parent, key);

    if (!schema) {
      return value;
    }

    var normalizedValue = visit(value, parent, key, schema, addEntity, visitedEntities);
    return this.isSingleSchema || normalizedValue === undefined || normalizedValue === null ? normalizedValue : {
      id: normalizedValue,
      schema: this.getSchemaAttribute(value, parent, key)
    };
  };

  _proto.denormalizeValue = function denormalizeValue(value, unvisit) {
    var schemaKey = isImmutable(value) ? value.get('schema') : value.schema;

    if (!this.isSingleSchema && !schemaKey) {
      return value;
    }

    var id = isImmutable(value) ? value.get('id') : value.id;
    var schema = this.isSingleSchema ? this.schema : this.schema[schemaKey];
    return unvisit(id || value, schema);
  };

  _createClass(PolymorphicSchema, [{
    key: "isSingleSchema",
    get: function get() {
      return !this._schemaAttribute;
    }
  }]);

  return PolymorphicSchema;
}();

var UnionSchema =
/*#__PURE__*/
function (_PolymorphicSchema) {
  _inheritsLoose(UnionSchema, _PolymorphicSchema);

  function UnionSchema(definition, schemaAttribute) {
    if (!schemaAttribute) {
      throw new Error('Expected option "schemaAttribute" not found on UnionSchema.');
    }

    return _PolymorphicSchema.call(this, definition, schemaAttribute) || this;
  }

  var _proto = UnionSchema.prototype;

  _proto.normalize = function normalize(input, parent, key, visit, addEntity, visitedEntities) {
    return this.normalizeValue(input, parent, key, visit, addEntity, visitedEntities);
  };

  _proto.denormalize = function denormalize(input, unvisit) {
    return this.denormalizeValue(input, unvisit);
  };

  return UnionSchema;
}(PolymorphicSchema);

var ValuesSchema =
/*#__PURE__*/
function (_PolymorphicSchema) {
  _inheritsLoose(ValuesSchema, _PolymorphicSchema);

  function ValuesSchema() {
    return _PolymorphicSchema.apply(this, arguments) || this;
  }

  var _proto = ValuesSchema.prototype;

  _proto.normalize = function normalize(input, parent, key, visit, addEntity, visitedEntities) {
    var _this = this;

    return Object.keys(input).reduce(function (output, key, index) {
      var _objectSpread2;

      var value = input[key];
      return value !== undefined && value !== null ? _objectSpread({}, output, (_objectSpread2 = {}, _objectSpread2[key] = _this.normalizeValue(value, input, key, visit, addEntity, visitedEntities), _objectSpread2)) : output;
    }, {});
  };

  _proto.denormalize = function denormalize(input, unvisit) {
    var _this2 = this;

    return Object.keys(input).reduce(function (output, key) {
      var _objectSpread3;

      var entityOrId = input[key];
      return _objectSpread({}, output, (_objectSpread3 = {}, _objectSpread3[key] = _this2.denormalizeValue(entityOrId, unvisit), _objectSpread3));
    }, {});
  };

  return ValuesSchema;
}(PolymorphicSchema);

var validateSchema = function validateSchema(definition) {
  var isArray = Array.isArray(definition);

  if (isArray && definition.length > 1) {
    throw new Error("Expected schema definition to be a single schema, but found " + definition.length + ".");
  }

  return definition[0];
};

var getValues = function getValues(input) {
  return Array.isArray(input) ? input : Object.keys(input).map(function (key) {
    return input[key];
  });
};

var normalize = function normalize(schema, input, parent, key, visit, addEntity, visitedEntities) {
  schema = validateSchema(schema);
  var values = getValues(input); // Special case: Arrays pass *their* parent on to their children, since there
  // is not any special information that can be gathered from themselves directly

  return values.map(function (value, index) {
    return visit(value, parent, key, schema, addEntity, visitedEntities);
  });
};

var ArraySchema =
/*#__PURE__*/
function (_PolymorphicSchema) {
  _inheritsLoose(ArraySchema, _PolymorphicSchema);

  function ArraySchema() {
    return _PolymorphicSchema.apply(this, arguments) || this;
  }

  var _proto = ArraySchema.prototype;

  _proto.normalize = function normalize(input, parent, key, visit, addEntity, visitedEntities) {
    var _this = this;

    var values = getValues(input);
    return values.map(function (value, index) {
      return _this.normalizeValue(value, parent, key, visit, addEntity, visitedEntities);
    }).filter(function (value) {
      return value !== undefined && value !== null;
    });
  };

  _proto.denormalize = function denormalize(input, unvisit) {
    var _this2 = this;

    return input && input.map ? input.map(function (value) {
      return _this2.denormalizeValue(value, unvisit);
    }) : input;
  };

  return ArraySchema;
}(PolymorphicSchema);

var _normalize = function normalize(schema, input, parent, key, visit, addEntity, visitedEntities) {
  var object = _objectSpread({}, input);

  Object.keys(schema).forEach(function (key) {
    var localSchema = schema[key];
    var value = visit(input[key], input, key, localSchema, addEntity, visitedEntities);

    if (value === undefined || value === null) {
      delete object[key];
    } else {
      object[key] = value;
    }
  });
  return object;
};

var _denormalize = function denormalize(schema, input, unvisit) {
  if (isImmutable(input)) {
    return denormalizeImmutable(schema, input, unvisit);
  }

  var object = _objectSpread({}, input);

  Object.keys(schema).forEach(function (key) {
    if (object[key] != null) {
      object[key] = unvisit(object[key], schema[key]);
    }
  });
  return object;
};

var ObjectSchema =
/*#__PURE__*/
function () {
  function ObjectSchema(definition) {
    this.define(definition);
  }

  var _proto = ObjectSchema.prototype;

  _proto.define = function define(definition) {
    this.schema = Object.keys(definition).reduce(function (entitySchema, key) {
      var _objectSpread2;

      var schema = definition[key];
      return _objectSpread({}, entitySchema, (_objectSpread2 = {}, _objectSpread2[key] = schema, _objectSpread2));
    }, this.schema || {});
  };

  _proto.normalize = function normalize() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _normalize.apply(void 0, [this.schema].concat(args));
  };

  _proto.denormalize = function denormalize() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _denormalize.apply(void 0, [this.schema].concat(args));
  };

  return ObjectSchema;
}();

var visit = function visit(value, parent, key, schema, addEntity, visitedEntities) {
  if (typeof value !== 'object' || !value) {
    return value;
  }

  if (typeof schema === 'object' && (!schema.normalize || typeof schema.normalize !== 'function')) {
    var method = Array.isArray(schema) ? normalize : _normalize;
    return method(schema, value, parent, key, visit, addEntity, visitedEntities);
  }

  return schema.normalize(value, parent, key, visit, addEntity, visitedEntities);
};

var addEntities = function addEntities(entities) {
  return function (schema, processedEntity, value, parent, key) {
    var schemaKey = schema.key;
    var id = schema.getId(value, parent, key);

    if (!(schemaKey in entities)) {
      entities[schemaKey] = {};
    }

    var existingEntity = entities[schemaKey][id];

    if (existingEntity) {
      entities[schemaKey][id] = schema.merge(existingEntity, processedEntity);
    } else {
      entities[schemaKey][id] = processedEntity;
    }
  };
};

var schema = {
  Array: ArraySchema,
  Entity: EntitySchema,
  Object: ObjectSchema,
  Union: UnionSchema,
  Values: ValuesSchema
};
var normalize$1 = function normalize(input, schema) {
  if (!input || typeof input !== 'object') {
    throw new Error("Unexpected input given to normalize. Expected type to be \"object\", found \"" + typeof input + "\".");
  }

  var entities = {};
  var addEntity = addEntities(entities);
  var visitedEntities = [];
  var result = visit(input, input, null, schema, addEntity, visitedEntities);
  return {
    entities: entities,
    result: result
  };
};

var Normalizer = /** @class */ (function () {
    function Normalizer() {
    }
    /**
     * Normalize the data given data.
     */
    Normalizer.process = function (query, record) {
        if (Utils.isEmpty(record)) {
            return {};
        }
        var entity = query.database().schemas[query.model.entity];
        var schema = Array.isArray(record) ? [entity] : entity;
        return normalize$1(record, schema).entities;
    };
    return Normalizer;
}());

var PivotCreator = /** @class */ (function () {
    function PivotCreator() {
    }
    /**
     * Create an intermediate entity if the data contains any entities that
     * require it for example `belongsTo` or `morphMany`.
     */
    PivotCreator.process = function (query, data) {
        Object.keys(data).forEach(function (entity) {
            var model = query.getModel(entity);
            if (model.hasPivotFields()) {
                Utils.forOwn(model.pivotFields(), function (field) {
                    Utils.forOwn(field, function (attr, key) { attr.createPivots(model, data, key); });
                });
            }
        });
        return data;
    };
    return PivotCreator;
}());

var Attacher = /** @class */ (function () {
    function Attacher() {
    }
    /**
     * Attach missing relational key to the records.
     */
    Attacher.process = function (query, data) {
        Utils.forOwn(data, function (entity, name) {
            var fields = query.getModel(name).fields();
            Utils.forOwn(entity, function (record) {
                Utils.forOwn(record, function (value, key) {
                    var field = fields[key];
                    if (field instanceof Relation) {
                        value !== null && field.attach(value, record, data);
                    }
                });
            });
        });
        return data;
    };
    return Attacher;
}());

var Processor = /** @class */ (function () {
    function Processor() {
    }
    /**
     * Normalize the given data.
     */
    Processor.normalize = function (query, record) {
        // First, let's normalize the data.
        var data = Normalizer.process(query, record);
        // Then, attach any missing foreign keys. For example, if a User has many
        // Post nested but without foreign key such as `user_id`, we can attach
        // the `user_id` value to the Post entities.
        data = Attacher.process(query, data);
        // Now we'll create any missing pivot entities for relationships such as
        // `belongsTo` or `morphMany`.
        data = PivotCreator.process(query, data);
        // And we'll return the result as a normalized data.
        return data;
    };
    return Processor;
}());

var WhereFilter = /** @class */ (function () {
    function WhereFilter() {
    }
    /**
     * Filter the given data by registered where clause.
     */
    WhereFilter.filter = function (query, records) {
        var _this = this;
        if (query.wheres.length === 0) {
            return records;
        }
        return records.filter(function (record) { return _this.check(query, record); });
    };
    /**
     * Checks if given Record matches the registered where clause.
     */
    WhereFilter.check = function (query, record) {
        var whereTypes = Utils.groupBy(query.wheres, function (where) { return where.boolean; });
        var comparator = this.getComparator(query, record);
        var results = [];
        whereTypes.and && results.push(whereTypes.and.every(comparator));
        whereTypes.or && results.push(whereTypes.or.some(comparator));
        return results.indexOf(true) !== -1;
    };
    /**
     * Get comparator for the where clause.
     */
    WhereFilter.getComparator = function (query, record) {
        var _this = this;
        return function (where) {
            // Function with Record and Query as argument.
            if (typeof where.field === 'function') {
                var newQuery = new Query(query.rootState, query.entity);
                var result = _this.executeWhereClosure(newQuery, record, where.field);
                if (typeof result === 'boolean') {
                    return result;
                }
                // If closure returns undefined, we need to execute the local query.
                var matchingRecords = newQuery.get();
                // And check if current record is part of the result.
                return !Utils.isEmpty(matchingRecords.filter(function (rec) {
                    return rec['$id'] === record['$id'];
                }));
            }
            // Function with Record value as argument.
            if (typeof where.value === 'function') {
                return where.value(record[where.field]);
            }
            // Check if field value is in given where Array.
            if (Array.isArray(where.value)) {
                return where.value.indexOf(record[where.field]) !== -1;
            }
            // Simple equal check.
            return record[where.field] === where.value;
        };
    };
    /**
     * Execute where closure.
     */
    WhereFilter.executeWhereClosure = function (query, record, closure) {
        if (closure.length !== 3) {
            return closure(record, query);
        }
        var model = new query.model(record);
        return closure(record, query, model);
    };
    return WhereFilter;
}());

var OrderByFilter = /** @class */ (function () {
    function OrderByFilter() {
    }
    /**
     * Sort the given data by registered orders.
     */
    OrderByFilter.filter = function (query, records) {
        if (query.orders.length === 0) {
            return records;
        }
        var keys = query.orders.map(function (order) { return order.key; });
        var directions = query.orders.map(function (order) { return order.direction; });
        return Utils.orderBy(records, keys, directions);
    };
    return OrderByFilter;
}());

var LimitFilter = /** @class */ (function () {
    function LimitFilter() {
    }
    /**
     * Limit the given records by the lmilt and offset.
     */
    LimitFilter.filter = function (query, records) {
        return records.slice(query.offsetNumber, query.offsetNumber + query.limitNumber);
    };
    return LimitFilter;
}());

var Filter = /** @class */ (function () {
    function Filter() {
    }
    /**
     * Filter the given data by registered where clause.
     */
    Filter.where = function (query, records) {
        return WhereFilter.filter(query, records);
    };
    /**
     * Sort the given data by registered orders.
     */
    Filter.orderBy = function (query, records) {
        return OrderByFilter.filter(query, records);
    };
    /**
     * Limit the given records by the lmilt and offset.
     */
    Filter.limit = function (query, records) {
        return LimitFilter.filter(query, records);
    };
    return Filter;
}());

var Loader = /** @class */ (function () {
    function Loader() {
    }
    /**
     * Set the relationships that should be eager loaded with the query.
     */
    Loader.with = function (query, name, constraint) {
        var _this = this;
        // If the name of the relation is `*`, we'll load all relationships.
        if (name === '*') {
            this.withAll(query);
            return;
        }
        // If we passed an array, we dispatch the bits to with queries.
        if (Array.isArray(name)) {
            name.forEach(function (relationName) { return _this.with(query, relationName, constraint); });
            return;
        }
        // Else parse relations and set appropriate constraints.
        this.parseWithRelations(query, name.split('.'), constraint);
    };
    /**
     * Set all relationships to be eager loaded with the query.
     */
    Loader.withAll = function (query, constraint) {
        if (constraint === void 0) { constraint = function () { return null; }; }
        var fields = query.model.getFields();
        for (var field in fields) {
            fields[field] instanceof Relation && this.with(query, field, constraint);
        }
    };
    /**
     * Set relationships to be recursively eager loaded with the query.
     */
    Loader.withAllRecursive = function (query, depth) {
        this.withAll(query, function (relatedQuery) {
            depth > 0 && relatedQuery.withAllRecursive(depth - 1);
        });
    };
    /**
     * Set eager load relation and constraint.
     */
    Loader.setEagerLoad = function (query, name, constraint) {
        if (constraint === void 0) { constraint = null; }
        if (!query.load[name]) {
            query.load[name] = [];
        }
        constraint && query.load[name].push(constraint);
    };
    /**
     * Parse a list of relations into individuals.
     */
    Loader.parseWithRelations = function (query, relations, constraint) {
        var _this = this;
        // First we'll get the very first relationship from teh whole relations.
        var relation = relations[0];
        // If the first relation has "or" syntax which is `|` for example
        // `posts|videos`, set each of them as separate eager load.
        relation.split('|').forEach(function (name) {
            // If there's only one relationship in relations array, that means
            // there's no nested relationship. So we'll set the given
            // constraint to the relationship loading.
            if (relations.length === 1) {
                _this.setEagerLoad(query, name, constraint);
                return;
            }
            // Else we'll skip adding constraint because the constraint has to be
            // applied to the nested relationship. We'll let `addNestedWiths`
            // method to handle that later.
            _this.setEagerLoad(query, name);
        });
        // If the given relations only contains a single name, which means it
        // doesn't have any nested relations such as `posts.comments`, we
        // don't need go farther so return here.
        if (relations.length === 1) {
            return;
        }
        // Finally, we shift the first relation from the array and handle lest
        // of relations as a nested relation.
        relations.shift();
        this.addNestedWiths(query, relation, relations, constraint);
    };
    /**
     * Parse the nested relationships in a relation.
     */
    Loader.addNestedWiths = function (query, name, children, constraint) {
        this.setEagerLoad(query, name, function (nestedQuery) {
            nestedQuery.with(children.join('.'), constraint);
        });
    };
    /**
     * Eager load the relationships for the given collection.
     */
    Loader.eagerLoadRelations = function (query, collection) {
        var fields = query.model.getFields();
        for (var name_1 in query.load) {
            var constraints = query.load[name_1];
            var relation = fields[name_1];
            if (relation instanceof Relation) {
                relation.load(query, collection, name_1, constraints);
                continue;
            }
            // If no relation was found on the query, it might be run on the
            // base entity of a hierarchy. In this case, we try looking up
            // the relation on the derived entities
            if (query.model.hasTypes()) {
                var candidateRelation = query.model.findRelationInSubTypes(name_1);
                if (candidateRelation !== null) {
                    candidateRelation.load(query, collection, name_1, constraints);
                }
            }
        }
    };
    return Loader;
}());

var Rollcaller = /** @class */ (function () {
    function Rollcaller() {
    }
    /**
     * Set where constraint based on relationship existence.
     */
    Rollcaller.has = function (query, relation, operator, count) {
        this.setHas(query, relation, 'exists', operator, count);
    };
    /**
     * Set where constraint based on relationship absence.
     */
    Rollcaller.hasNot = function (query, relation, operator, count) {
        this.setHas(query, relation, 'doesntExist', operator, count);
    };
    /**
     * Add where has condition.
     */
    Rollcaller.whereHas = function (query, relation, constraint) {
        this.setHas(query, relation, 'exists', undefined, undefined, constraint);
    };
    /**
     * Add where has not condition.
     */
    Rollcaller.whereHasNot = function (query, relation, constraint) {
        this.setHas(query, relation, 'doesntExist', undefined, undefined, constraint);
    };
    /**
     * Set `has` condition.
     */
    Rollcaller.setHas = function (query, relation, type, operator, count, constraint) {
        if (operator === void 0) { operator = '>='; }
        if (count === void 0) { count = 1; }
        if (constraint === void 0) { constraint = null; }
        if (typeof operator === 'number') {
            query.have.push({ relation: relation, type: type, operator: '>=', count: operator, constraint: constraint });
            return;
        }
        query.have.push({ relation: relation, type: type, operator: operator, count: count, constraint: constraint });
    };
    /**
     * Convert `has` conditions to where clause. It will check any relationship
     * existence, or absence for the records then set ids of the records that
     * matched the condition to `where` clause.
     *
     * This way, when the query gets executed, only those records that matched
     * the `has` condition get retrieved. In the future, once relationship index
     * mapping is implemented, we can simply do all checks inside the where
     * filter since we can treat `has` condition as usual `where` condition.
     *
     * For now, since we must fetch any relationship by eager loading them, due
     * to performance concern, we'll apply `has` conditions this way to gain
     * maximum performance.
     */
    Rollcaller.applyConstraints = function (query) {
        if (query.have.length === 0) {
            return;
        }
        var newQuery = query.newQuery();
        this.addHasWhereConstraints(query, newQuery);
        this.addHasConstraints(query, newQuery.get());
    };
    /**
     * Add has constraints to the given query. It's going to set all relationship
     * as `with` alongside with its closure constraints.
     */
    Rollcaller.addHasWhereConstraints = function (query, newQuery) {
        query.have.forEach(function (constraint) {
            newQuery.with(constraint.relation, constraint.constraint);
        });
    };
    /**
     * Add has constraints as where clause.
     */
    Rollcaller.addHasConstraints = function (query, collection) {
        var comparators = this.getComparators(query);
        var ids = [];
        collection.forEach(function (model) {
            if (comparators.every(function (comparator) { return comparator(model); })) {
                ids.push(model.$self().getIdFromRecord(model));
            }
        });
        query.whereIdIn(ids);
    };
    /**
     * Get comparators for the has clause.
     */
    Rollcaller.getComparators = function (query) {
        var _this = this;
        return query.have.map(function (constraint) { return _this.getComparator(constraint); });
    };
    /**
     * Get a comparator for the has clause.
     */
    Rollcaller.getComparator = function (constraint) {
        var _this = this;
        var compare = this.getCountComparator(constraint.operator);
        return function (model) {
            var count = _this.getRelationshipCount(model[constraint.relation]);
            var result = compare(count, constraint.count);
            return constraint.type === 'exists' ? result : !result;
        };
    };
    /**
     * Get count of the relationship.
     */
    Rollcaller.getRelationshipCount = function (relation) {
        if (Array.isArray(relation)) {
            return relation.length;
        }
        return relation ? 1 : 0;
    };
    /**
     * Get comparator function for the `has` clause.
     */
    Rollcaller.getCountComparator = function (operator) {
        switch (operator) {
            case '=':
                return function (x, y) { return x === y; };
            case '>':
                return function (x, y) { return x > y; };
            case '>=':
                return function (x, y) { return x >= y; };
            case '<':
                return function (x, y) { return x > 0 && x < y; };
            case '<=':
                return function (x, y) { return x > 0 && x <= y; };
            default:
                return function (x, y) { return x === y; };
        }
    };
    return Rollcaller;
}());

var Query = /** @class */ (function () {
    /**
     * Create a new Query instance.
     */
    function Query(state, entity) {
        /**
         * This flag lets us know if current Query instance applies to
         * a base class or not (in order to know when to filter out
         * some records).
         */
        this.appliedOnBase = true;
        /**
         * Primary key ids to filter records by. It is used for filtering records
         * direct key lookup when a user is trying to fetch records by its
         * primary key.
         *
         * It should not be used if there is a logic which prevents index usage, for
         * example, an "or" condition which already requires a full scan of records.
         */
        this.idFilter = null;
        /**
         * Whether to use `idFilter` key lookup. True if there is a logic which
         * prevents index usage, for example, an "or" condition which already
         * requires full scan.
         */
        this.cancelIdFilter = false;
        /**
         * Primary key ids to filter joined records. It is used for filtering
         * records direct key lookup. It should not be cancelled, because it
         * is free from the effects of normal where methods.
         */
        this.joinedIdFilter = null;
        /**
         * The where constraints for the query.
         */
        this.wheres = [];
        /**
         * The has constraints for the query.
         */
        this.have = [];
        /**
         * The orders of the query result.
         */
        this.orders = [];
        /**
         * Number of results to skip.
         */
        this.offsetNumber = 0;
        /**
         * Maximum number of records to return.
         *
         * We use polyfill of `Number.MAX_SAFE_INTEGER` for IE11 here.
         */
        this.limitNumber = Math.pow(2, 53) - 1;
        /**
         * The relationships that should be eager loaded with the result.
         */
        this.load = {};
        // All entitites with same base class are stored in the same state.
        var baseModel = this.getBaseModel(entity);
        this.rootState = state;
        this.state = state[baseModel.entity];
        this.entity = entity;
        this.model = this.getModel(entity);
        this.appliedOnBase = baseModel.entity === entity;
    }
    /**
     * Get the database from the container.
     */
    Query.database = function () {
        return Container.database;
    };
    /**
     * Get model of given name from the container.
     */
    Query.getModel = function (name) {
        return this.database().model(name);
    };
    /**
     * Get base model of given name from the container.
     */
    Query.getBaseModel = function (name) {
        return this.database().baseModel(name);
    };
    /**
     * Get all models from the container.
     */
    Query.getModels = function () {
        return this.database().models();
    };
    /**
     * Delete all records from the store.
     */
    Query.deleteAll = function (state) {
        var models = this.getModels();
        for (var entity in models) {
            state[entity] && (new this(state, entity)).deleteAll();
        }
    };
    /**
     * Register a global hook. It will return ID for the hook that users may use
     * it to unregister hooks.
     */
    Query.on = function (on, callback) {
        var id = ++this.lastHookId;
        if (!this.hooks[on]) {
            this.hooks[on] = [];
        }
        this.hooks[on].push({ id: id, callback: callback });
        return id;
    };
    /**
     * Unregister global hook with the given id.
     */
    Query.off = function (id) {
        var _this = this;
        return Object.keys(this.hooks).some(function (on) {
            var hooks = _this.hooks[on];
            var index = hooks.findIndex(function (h) { return h.id === id; });
            if (index === -1) {
                return false;
            }
            hooks.splice(index, 1);
            return true;
        });
    };
    /**
     * Get query class.
     */
    Query.prototype.self = function () {
        return this.constructor;
    };
    /**
     * Create a new query instance.
     */
    Query.prototype.newQuery = function (entity) {
        entity = entity || this.entity;
        return (new Query(this.rootState, entity));
    };
    /**
     * Get the database from the container.
     */
    Query.prototype.database = function () {
        return this.self().database();
    };
    /**
     * Get model of given name from the container.
     */
    Query.prototype.getModel = function (name) {
        var entity = name || this.entity;
        return this.self().getModel(entity);
    };
    /**
     * Get all models from the container.
     */
    Query.prototype.getModels = function () {
        return this.self().getModels();
    };
    /**
     * Get base model of given name from the container.
     */
    Query.prototype.getBaseModel = function (name) {
        return this.self().getBaseModel(name);
    };
    /**
     * Returns all record of the query chain result. This method is alias
     * of the `get` method.
     */
    Query.prototype.all = function () {
        return this.get();
    };
    /**
     * Find the record by the given id.
     */
    Query.prototype.find = function (id) {
        var indexId = Array.isArray(id) ? JSON.stringify(id) : id;
        var record = this.state.data[indexId];
        if (!record) {
            return null;
        }
        return this.item(this.hydrate(record));
    };
    /**
     * Get the record of the given array of ids.
     */
    Query.prototype.findIn = function (idList) {
        var _this = this;
        return idList.reduce(function (collection, id) {
            var indexId = Array.isArray(id) ? JSON.stringify(id) : id;
            var record = _this.state.data[indexId];
            if (!record) {
                return collection;
            }
            collection.push(_this.hydrate(record));
            return collection;
        }, []);
    };
    /**
     * Returns all record of the query chain result.
     */
    Query.prototype.get = function () {
        var records = this.select();
        return this.collect(records);
    };
    /**
     * Returns the first record of the query chain result.
     */
    Query.prototype.first = function () {
        var records = this.select();
        if (records.length === 0) {
            return null;
        }
        return this.item(this.hydrate(records[0]));
    };
    /**
     * Returns the last record of the query chain result.
     */
    Query.prototype.last = function () {
        var records = this.select();
        if (records.length === 0) {
            return null;
        }
        return this.item(this.hydrate(records[records.length - 1]));
    };
    /**
     * Add a and where clause to the query.
     */
    Query.prototype.where = function (field, value) {
        if (this.isIdfilterable(field)) {
            this.setIdFilter(value);
        }
        this.wheres.push({ field: field, value: value, boolean: 'and' });
        return this;
    };
    /**
     * Add a or where clause to the query.
     */
    Query.prototype.orWhere = function (field, value) {
        // Cacncel id filter usage, since "or" needs full scan.
        this.cancelIdFilter = true;
        this.wheres.push({ field: field, value: value, boolean: 'or' });
        return this;
    };
    /**
     * Filter records by their primary key.
     */
    Query.prototype.whereId = function (value) {
        return this.where(this.model.primaryKey, value);
    };
    /**
     * Filter records by their primary keys.
     */
    Query.prototype.whereIdIn = function (values) {
        return this.where(this.model.primaryKey, values);
    };
    /**
     * Fast comparison for foreign keys. If the foreign key is the primary key,
     * it uses object lookup, fallback normal where otherwise.
     *
     * Why separate `whereFk` instead of just `where`? Additional logic needed
     * for the distinction between where and orWhere in normal queries, but
     * Fk lookups are always "and" type.
     */
    Query.prototype.whereFk = function (field, value) {
        var values = Array.isArray(value) ? value : [value];
        // If lookup filed is the primary key. Initialize or get intersection,
        // because boolean and could have a condition such as
        // `whereId(1).whereId(2).get()`.
        if (field === this.model.primaryKey) {
            this.setJoinedIdFilter(values);
            return this;
        }
        // Else fallback to normal where.
        this.where(field, values);
        return this;
    };
    /**
     * Check whether the given field and value combination is filterable through
     * primary key direct look up.
     */
    Query.prototype.isIdfilterable = function (field) {
        return field === this.model.primaryKey && !this.cancelIdFilter;
    };
    /**
     * Set id filter for the given where condition.
     */
    Query.prototype.setIdFilter = function (value) {
        var _this = this;
        var values = Array.isArray(value) ? value : [value];
        // Initialize or get intersection, because boolean and could have a
        // condition such as `whereIdIn([1,2,3]).whereIdIn([1,2]).get()`.
        if (this.idFilter === null) {
            this.idFilter = new Set(values);
            return;
        }
        this.idFilter = new Set(values.filter(function (v) { return _this.idFilter.has(v); }));
    };
    /**
     * Set joined id filter for the given where condition.
     */
    Query.prototype.setJoinedIdFilter = function (values) {
        var _this = this;
        // Initialize or get intersection, because boolean and could have a
        // condition such as `whereId(1).whereId(2).get()`.
        if (this.joinedIdFilter === null) {
            this.joinedIdFilter = new Set(values);
            return;
        }
        this.joinedIdFilter = new Set(values.filter(function (v) { return _this.joinedIdFilter.has(v); }));
    };
    /**
     * Add an order to the query.
     */
    Query.prototype.orderBy = function (key, direction) {
        if (direction === void 0) { direction = 'asc'; }
        this.orders.push({ key: key, direction: direction });
        return this;
    };
    /**
     * Add an offset to the query.
     */
    Query.prototype.offset = function (offset) {
        this.offsetNumber = offset;
        return this;
    };
    /**
     * Add limit to the query.
     */
    Query.prototype.limit = function (limit) {
        this.limitNumber = limit;
        return this;
    };
    /**
     * Set the relationships that should be loaded.
     */
    Query.prototype.with = function (name, constraint) {
        if (constraint === void 0) { constraint = null; }
        Loader.with(this, name, constraint);
        return this;
    };
    /**
     * Query all relations.
     */
    Query.prototype.withAll = function () {
        Loader.withAll(this);
        return this;
    };
    /**
     * Query all relations recursively.
     */
    Query.prototype.withAllRecursive = function (depth) {
        if (depth === void 0) { depth = 3; }
        Loader.withAllRecursive(this, depth);
        return this;
    };
    /**
     * Set where constraint based on relationship existence.
     */
    Query.prototype.has = function (relation, operator, count) {
        Rollcaller.has(this, relation, operator, count);
        return this;
    };
    /**
     * Set where constraint based on relationship absence.
     */
    Query.prototype.hasNot = function (relation, operator, count) {
        Rollcaller.hasNot(this, relation, operator, count);
        return this;
    };
    /**
     * Add where has condition.
     */
    Query.prototype.whereHas = function (relation, constraint) {
        Rollcaller.whereHas(this, relation, constraint);
        return this;
    };
    /**
     * Add where has not condition.
     */
    Query.prototype.whereHasNot = function (relation, constraint) {
        Rollcaller.whereHasNot(this, relation, constraint);
        return this;
    };
    /**
     * Get all records from the state and convert them into the array of
     * model instances.
     */
    Query.prototype.records = function () {
        var _this = this;
        this.finalizeIdFilter();
        return this.getIdsToLookup().reduce(function (models, id) {
            var record = _this.state.data[id];
            if (!record) {
                return models;
            }
            var model = _this.hydrate(record);
            // Ignore if the model is not current type of model.
            if (!_this.appliedOnBase && !(model instanceof _this.model)) {
                return models;
            }
            models.push(model);
            return models;
        }, []);
    };
    /**
     * Check whether if id filters should on select. If not, clear out id filter.
     */
    Query.prototype.finalizeIdFilter = function () {
        if (!this.cancelIdFilter || this.idFilter === null) {
            return;
        }
        this.where(this.model.primaryKey, Array.from(this.idFilter.values()));
        this.idFilter = null;
    };
    /**
     * Get a list of id that should be used to lookup when fetching records
     * from the state.
     */
    Query.prototype.getIdsToLookup = function () {
        var _this = this;
        // If both id filter and joined id filter are set, intersect them.
        if (this.idFilter && this.joinedIdFilter) {
            return Array.from(this.idFilter.values()).filter(function (id) {
                return _this.joinedIdFilter.has(id);
            });
        }
        // If only either one is set, return which one is set.
        if (this.idFilter || this.joinedIdFilter) {
            return Array.from((this.idFilter || this.joinedIdFilter).values());
        }
        // If none is set, return all keys.
        return Object.keys(this.state.data);
    };
    /**
     * Process the query and filter data.
     */
    Query.prototype.select = function () {
        // At first, well apply any `has` condition to the query.
        Rollcaller.applyConstraints(this);
        // Next, get all record as an array and then start filtering it through.
        var records = this.records();
        // Process `beforeSelect` hook.
        records = this.executeRetrieveHook('beforeSelect', records);
        // Let's filter the records at first by the where clauses.
        records = this.filterWhere(records);
        // Process `afterWhere` hook.
        records = this.executeRetrieveHook('afterWhere', records);
        // Next, lets sort the data.
        records = this.filterOrderBy(records);
        // Process `afterOrderBy` hook.
        records = this.executeRetrieveHook('afterOrderBy', records);
        // Finally, slice the record by limit and offset.
        records = this.filterLimit(records);
        // Process `afterLimit` hook.
        records = this.executeRetrieveHook('afterLimit', records);
        return records;
    };
    /**
     * Filter the given data by registered where clause.
     */
    Query.prototype.filterWhere = function (records) {
        return Filter.where(this, records);
    };
    /**
     * Sort the given data by registered orders.
     */
    Query.prototype.filterOrderBy = function (records) {
        return Filter.orderBy(this, records);
    };
    /**
     * Limit the given records by the lmilt and offset.
     */
    Query.prototype.filterLimit = function (records) {
        return Filter.limit(this, records);
    };
    /**
     * Get the count of the retrieved data.
     */
    Query.prototype.count = function () {
        return this.get().length;
    };
    /**
     * Get the max value of the specified filed.
     */
    Query.prototype.max = function (field) {
        var numbers = this.get().reduce(function (numbers, item) {
            if (typeof item[field] === 'number') {
                numbers.push(item[field]);
            }
            return numbers;
        }, []);
        return numbers.length === 0 ? 0 : Math.max.apply(Math, numbers);
    };
    /**
     * Get the min value of the specified filed.
     */
    Query.prototype.min = function (field) {
        var numbers = this.get().reduce(function (numbers, item) {
            if (typeof item[field] === 'number') {
                numbers.push(item[field]);
            }
            return numbers;
        }, []);
        return numbers.length === 0 ? 0 : Math.min.apply(Math, numbers);
    };
    /**
     * Get the sum value of the specified filed.
     */
    Query.prototype.sum = function (field) {
        return this.get().reduce(function (sum, item) {
            if (typeof item[field] === 'number') {
                sum += item[field];
            }
            return sum;
        }, 0);
    };
    /**
     * Create a item from given record.
     */
    Query.prototype.item = function (item) {
        if (Object.keys(this.load).length > 0) {
            Loader.eagerLoadRelations(this, [item]);
        }
        return item;
    };
    /**
     * Create a collection (array) from given records.
     */
    Query.prototype.collect = function (collection) {
        var _this = this;
        if (collection.length < 1) {
            return [];
        }
        if (Object.keys(this.load).length > 0) {
            collection = collection.map(function (item) {
                var model = _this.model.getModelFromRecord(item);
                return new model(item);
            });
            Loader.eagerLoadRelations(this, collection);
        }
        return collection;
    };
    /**
     * Filter all data in the store by the given predicate.
     */
    Query.prototype.filterData = function (predicate) {
        var _this = this;
        this.state.data = Object.keys(this.state.data).reduce(function (models, id) {
            var model = _this.hydrate(_this.state.data[id]);
            if (predicate(model)) {
                models[id] = model;
            }
            return models;
        }, {});
    };
    /**
     * Create new data with all fields filled by default values.
     */
    Query.prototype.new = function () {
        var record = (new this.model()).$toJson();
        var result = this.insert(record, {});
        return result[this.entity][0];
    };
    /**
     * Save given data to the store by replacing all existing records in the
     * store. If you want to save data without replacing existing records,
     * use the `insert` method instead.
     */
    Query.prototype.create = function (data, options) {
        return this.persist('create', data, options);
    };
    /**
     * Create records to the state.
     */
    Query.prototype.createRecords = function (records) {
        this.emptyState();
        return this.insertRecords(records);
    };
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    Query.prototype.insert = function (data, options) {
        return this.persist('insert', data, options);
    };
    /**
     * Insert records in the state.
     */
    Query.prototype.insertRecords = function (records) {
        var _this = this;
        var recordsToBeInserted = {};
        var models = [];
        var beforeHooks = this.buildHooks('beforeCreate');
        var _loop_1 = function (id) {
            var record = records[id];
            var model = this_1.hydrate(record);
            if (beforeHooks.some(function (hook) { return hook(model, _this.entity) === false; })) {
                return "continue";
            }
            models.push(model);
            recordsToBeInserted[id] = model.$toJson();
        };
        var this_1 = this;
        for (var id in records) {
            _loop_1(id);
        }
        this.state.data = __assign(__assign({}, this.state.data), recordsToBeInserted);
        var afterHooks = this.buildHooks('afterCreate');
        models.forEach(function (model) {
            afterHooks.forEach(function (hook) { hook(model, _this.entity); });
        });
        return models;
    };
    /**
     * Update data in the state.
     */
    Query.prototype.update = function (data, condition, options) {
        // If the data is array, simply normalize the data and update them.
        if (Array.isArray(data)) {
            return this.persist('update', data, options);
        }
        // OK, the data is not an array. Now let's check `data` to see what we can
        // do if it's a closure.
        if (typeof data === 'function') {
            // If the data is closure, but if there's no condition, we wouldn't know
            // what record to update so raise an error and abort.
            if (!condition) {
                throw new Error('You must specify `where` to update records by specifying `data` as a closure.');
            }
            // If the condition is a closure, then update records by the closure.
            if (typeof condition === 'function') {
                return this.updateByCondition(data, condition);
            }
            // Else the condition is either String or Number, so let's
            // update the record by ID.
            return this.updateById(data, condition);
        }
        // Now the data is not a closure, and it's not an array, so it should be an object.
        // If the condition is closure, we can't normalize the data so let's update
        // records using the closure.
        if (typeof condition === 'function') {
            return this.updateByCondition(data, condition);
        }
        // If there's no condition, let's normalize the data and update them.
        if (!condition) {
            return this.persist('update', data, options);
        }
        // Now since the condition is either String or Number, let's check if the
        // model's primary key is not a composite key. If yes, we can't set the
        // condition as ID value for the record so throw an error and abort.
        if (Array.isArray(this.model.primaryKey)) {
            throw new Error("\n        You can't specify `where` value as `string` or `number` when you\n        have a composite key defined in your model. Please include composite\n        keys to the `data` fields.\n      ");
        }
        // Finally, let's add condition as the primary key of the object and
        // then normalize them to update the records.
        return this.updateById(data, condition);
    };
    /**
     * Update all records.
     */
    Query.prototype.updateRecords = function (records) {
        var models = this.hydrateRecordsByMerging(records);
        return this.commitUpdate(models);
    };
    /**
     * Update the state by id.
     */
    Query.prototype.updateById = function (data, id) {
        var _a;
        id = typeof id === 'number' ? id.toString() : id;
        var record = this.state.data[id];
        if (!record) {
            return null;
        }
        var model = this.hydrate(record);
        var instances = (_a = {},
            _a[id] = this.processUpdate(data, model),
            _a);
        this.commitUpdate(instances);
        return instances[id];
    };
    /**
     * Update the state by condition.
     */
    Query.prototype.updateByCondition = function (data, condition) {
        var _this = this;
        var instances = Object.keys(this.state.data).reduce(function (instances, id) {
            var instance = _this.hydrate(_this.state.data[id]);
            if (!condition(instance)) {
                return instances;
            }
            instances[id] = _this.processUpdate(data, instance);
            return instances;
        }, {});
        return this.commitUpdate(instances);
    };
    /**
     * Update the given record with given data.
     */
    Query.prototype.processUpdate = function (data, instance) {
        if (typeof data === 'function') {
            data(instance);
            return instance;
        }
        // When the updated instance is not the base model, we tell te hydrate what model to use
        if (instance.constructor !== this.model && instance instanceof Model) {
            return this.hydrate(__assign(__assign({}, instance), data), instance.constructor);
        }
        return this.hydrate(__assign(__assign({}, instance), data));
    };
    /**
     * Commit `update` to the state.
     */
    Query.prototype.commitUpdate = function (models) {
        var _this = this;
        models = this.updateIndexes(models);
        var beforeHooks = this.buildHooks('beforeUpdate');
        var afterHooks = this.buildHooks('afterUpdate');
        var updated = [];
        var _loop_2 = function (id) {
            var _a;
            var model = models[id];
            if (beforeHooks.some(function (hook) { return hook(model, _this.entity) === false; })) {
                return "continue";
            }
            this_2.state.data = __assign(__assign({}, this_2.state.data), (_a = {}, _a[id] = model.$toJson(), _a));
            afterHooks.forEach(function (hook) { hook(model, _this.entity); });
            updated.push(model);
        };
        var this_2 = this;
        for (var id in models) {
            _loop_2(id);
        }
        return updated;
    };
    /**
     * Update the key of the instances. This is needed when a user updates
     * record's primary key. We must then update the index key to
     * correspond with new id value.
     */
    Query.prototype.updateIndexes = function (instances) {
        var _this = this;
        return Object.keys(instances).reduce(function (instances, key) {
            var instance = instances[key];
            var id = String(_this.model.getIndexIdFromRecord(instance));
            if (key !== id) {
                instance.$id = id;
                instances[id] = instance;
                delete instances[key];
            }
            return instances;
        }, instances);
    };
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    Query.prototype.insertOrUpdate = function (data, options) {
        return this.persist('insertOrUpdate', data, options);
    };
    /**
     * Insert or update the records.
     */
    Query.prototype.insertOrUpdateRecords = function (records) {
        var _this = this;
        var toBeInserted = {};
        var toBeUpdated = {};
        Object.keys(records).forEach(function (id) {
            var record = records[id];
            if (_this.state.data[id]) {
                toBeUpdated[id] = record;
                return;
            }
            toBeInserted[id] = record;
        });
        return __spreadArrays(this.insertRecords(toBeInserted), this.updateRecords(toBeUpdated));
    };
    /**
     * Persist data into the state.
     */
    Query.prototype.persist = function (method, data, options) {
        var _this = this;
        var normalizedData = this.normalize(data);
        if (Utils.isEmpty(normalizedData)) {
            if (method === 'create') {
                this.emptyState();
            }
            return {};
        }
        return Object.entries(normalizedData).reduce(function (collections, _a) {
            var entity = _a[0], records = _a[1];
            var newQuery = _this.newQuery(entity);
            var methodForEntity = _this.getPersistMethod(entity, options, method);
            var collection = newQuery.persistRecords(methodForEntity, records);
            if (collection.length > 0) {
                collections[entity] = collection;
            }
            return collections;
        }, {});
    };
    /**
     * Persist given records to the store by the given method.
     */
    Query.prototype.persistRecords = function (method, records) {
        switch (method) {
            case 'create':
                return this.createRecords(records);
            case 'insert':
                return this.insertRecords(records);
            case 'update':
                return this.updateRecords(records);
            case 'insertOrUpdate':
                return this.insertOrUpdateRecords(records);
        }
    };
    /**
     * Get persist method from given information.
     */
    Query.prototype.getPersistMethod = function (entity, options, fallback) {
        if (options.create && options.create.includes(entity)) {
            return 'create';
        }
        if (options.insert && options.insert.includes(entity)) {
            return 'insert';
        }
        if (options.update && options.update.includes(entity)) {
            return 'update';
        }
        if (options.insertOrUpdate && options.insertOrUpdate.includes(entity)) {
            return 'insertOrUpdate';
        }
        return fallback;
    };
    Query.prototype.delete = function (condition) {
        if (typeof condition === 'function') {
            return this.deleteByCondition(condition);
        }
        return this.deleteById(condition);
    };
    /**
     * Delete all records from the store. Even when deleting all records, we'll
     * iterate over all records to ensure that before and after hook will be
     * called for each existing records.
     */
    Query.prototype.deleteAll = function () {
        var _this = this;
        // If the target entity is the base entity and not inherited entity, we can
        // just delete all records.
        if (this.appliedOnBase) {
            return this.deleteByCondition(function () { return true; });
        }
        // Otherwise, we should filter out any derived entities from being deleted
        // so we'll add such filter here.
        return this.deleteByCondition(function (model) { return model instanceof _this.model; });
    };
    /**
     * Delete a record from the store by given id.
     */
    Query.prototype.deleteById = function (id) {
        var item = this.find(id);
        if (!item) {
            return null;
        }
        return this.deleteByCondition(function (model) { return model.$id === item.$id; })[0];
    };
    /**
     * Perform the actual delete query to the store.
     */
    Query.prototype.deleteByCondition = function (condition) {
        var _this = this;
        var deleted = [];
        this.filterData(function (model) {
            if (!condition(model)) {
                return true;
            }
            if (_this.executeBeforeDeleteHook(model) === false) {
                return true;
            }
            deleted.push(model);
            _this.executeAfterDeleteHook(model);
            return false;
        });
        return deleted;
    };
    /**
     * Normalize the given data.
     */
    Query.prototype.normalize = function (data) {
        return Processor.normalize(this, data);
    };
    /**
     * Convert given record to the model instance.
     */
    Query.prototype.hydrate = function (record, forceModel) {
        var _a;
        if (forceModel) {
            return new forceModel(record);
        }
        var newModel = this.model.getModelFromRecord(record);
        if (newModel !== null) {
            return new newModel(record);
        }
        if (!this.appliedOnBase && record[this.model.typeKey] === undefined) {
            var typeValue = this.model.getTypeKeyValueFromModel();
            record = __assign(__assign({}, record), (_a = {}, _a[this.model.typeKey] = typeValue, _a));
            return new this.model(record);
        }
        var baseModel = this.getBaseModel(this.entity);
        return new baseModel(record);
    };
    /**
     * Convert given records to instances by merging existing record. If there's
     * no existing record, that record will not be included in the result.
     */
    Query.prototype.hydrateRecordsByMerging = function (records) {
        var _this = this;
        return Object.keys(records).reduce(function (instances, id) {
            var recordInStore = _this.state.data[id];
            if (!recordInStore) {
                return instances;
            }
            var record = records[id];
            var modelForRecordInStore = _this.model.getModelFromRecord(recordInStore);
            if (modelForRecordInStore === null) {
                instances[id] = _this.hydrate(__assign(__assign({}, recordInStore), record));
                return instances;
            }
            instances[id] = _this.hydrate(__assign(__assign({}, recordInStore), record), modelForRecordInStore);
            return instances;
        }, {});
    };
    /**
     * Clears the current state from any data related to current model.
     *
     * - Everything if not in a inheritance scheme.
     * - Only derived instances if applied to a derived entity.
     */
    Query.prototype.emptyState = function () {
        var _this = this;
        if (this.appliedOnBase) {
            this.state.data = {};
            return;
        }
        this.state.data = Object.entries(this.state.data).reduce(function (records, _a) {
            var id = _a[0], record = _a[1];
            if (!(_this.model.getModelFromRecord(record) === _this.model)) {
                records[id] = record;
            }
            return records;
        }, {});
    };
    /**
     * Build before create hooks arra
     */
    Query.prototype.buildHooks = function (on) {
        var hooks = this.getGlobalHookAsArray(on);
        var localHook = this.model[on];
        localHook && hooks.push(localHook.bind(this.model));
        return hooks;
    };
    /**
     * Get global hook of the given name as array by stripping id key and keep
     * only hook functions.
     */
    Query.prototype.getGlobalHookAsArray = function (on) {
        var _this = this;
        var hooks = this.self().hooks[on];
        return hooks ? hooks.map(function (h) { return h.callback.bind(_this); }) : [];
    };
    /**
     * Execute retrieve hook for the given method.
     */
    Query.prototype.executeRetrieveHook = function (on, models) {
        var _this = this;
        var hooks = this.buildHooks(on);
        return hooks.reduce(function (collection, hook) {
            collection = hook(models, _this.entity);
            return collection;
        }, models);
    };
    /**
     * Execute before delete hook to the given model.
     */
    Query.prototype.executeBeforeDeleteHook = function (model) {
        if (this.executeLocalBeforeDeleteHook(model) === false) {
            return false;
        }
        if (this.executeGlobalBeforeDeleteHook(model) === false) {
            return false;
        }
    };
    /**
     * Execute local before delete hook to the given model.
     */
    Query.prototype.executeLocalBeforeDeleteHook = function (model) {
        var hook = this.model['beforeDelete'];
        return hook && hook(model, this.entity);
    };
    /**
     * Execute global before delete hook to the given model.
     */
    Query.prototype.executeGlobalBeforeDeleteHook = function (model) {
        var _this = this;
        return this.executeGlobalBeforeMutationHooks('beforeDelete', function (hook) {
            return hook(model, _this.entity);
        });
    };
    /**
     * Execute after delete hook to the given model.
     */
    Query.prototype.executeAfterDeleteHook = function (model) {
        this.executeLocalAfterDeleteHook(model);
        this.executeGlobalAfterDeleteHook(model);
    };
    /**
     * Execute local after delete hook to the given model.
     */
    Query.prototype.executeLocalAfterDeleteHook = function (model) {
        var hook = this.model['afterDelete'];
        return hook && hook(model, this.entity);
    };
    /**
     * Execute global after delete hook to the given model.
     */
    Query.prototype.executeGlobalAfterDeleteHook = function (model) {
        var _this = this;
        this.executeGlobalAfterMutationHooks('afterDelete', function (hook) {
            hook(model, _this.entity);
        });
    };
    /**
     * Execute global before mutation hook on the given method.
     */
    Query.prototype.executeGlobalBeforeMutationHooks = function (on, callback) {
        var hooks = this.self().hooks[on];
        if (!Array.isArray(hooks) || hooks.length <= 0) {
            return;
        }
        var result = hooks.some(function (hook) {
            return callback(hook.callback) === false ? false : true;
        });
        return result === false ? false : undefined;
    };
    /**
     * Execute global after mutation hook on the given method.
     */
    Query.prototype.executeGlobalAfterMutationHooks = function (on, callback) {
        var hooks = this.self().hooks[on];
        if (!Array.isArray(hooks)) {
            return;
        }
        hooks.forEach(function (hook) { callback(hook.callback); });
    };
    /**
     * The global lifecycle hook registries.
     */
    Query.hooks = {};
    /**
     * The counter to generate the UID for global hooks.
     */
    Query.lastHookId = 0;
    return Query;
}());

var RootGetters = {
    /**
     * Create a new Query instance.
     */
    query: function (state) { return function (entity) {
        return new Query(state, entity);
    }; },
    /**
     * Get all data of given entity.
     */
    all: function (state) { return function (entity) {
        return (new Query(state, entity)).all();
    }; },
    /**
     * Find a data of the given entity by given id.
     */
    find: function (state) { return function (entity, id) {
        return (new Query(state, entity)).find(id);
    }; },
    /**
     * Find a data of the given entity by given id.
     */
    findIn: function (state) { return function (entity, idList) {
        return (new Query(state, entity)).findIn(idList);
    }; }
};

function destroy$1(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            result = { data: {} };
            context.commit('delete', __assign(__assign({}, payload), { result: result }));
            return [2 /*return*/, result.data];
        });
    });
}
/**
 * Delete all data from the store.
 */
function deleteAll$1(context, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (payload && payload.entity) {
                context.commit('deleteAll', { entity: payload.entity });
                return [2 /*return*/];
            }
            context.commit('deleteAll');
            return [2 /*return*/];
        });
    });
}
var RootActions = {
    /**
     * Create new data with all fields filled by default values.
     */
    new: function (context, payload) {
        var result = { data: {} };
        context.commit('new', __assign(__assign({}, payload), { result: result }));
        return result.data;
    },
    /**
     * Save given data to the store by replacing all existing records in the
     * store. If you want to save data without replacing existing records,
     * use the `insert` method instead.
     */
    create: function (context, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = { data: {} };
                context.commit('create', __assign(__assign({}, payload), { result: result }));
                return [2 /*return*/, result.data];
            });
        });
    },
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    insert: function (context, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = { data: {} };
                context.commit('insert', __assign(__assign({}, payload), { result: result }));
                return [2 /*return*/, result.data];
            });
        });
    },
    /**
     * Update data in the store.
     */
    update: function (context, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = { data: {} };
                context.commit('update', __assign(__assign({}, payload), { result: result }));
                return [2 /*return*/, result.data];
            });
        });
    },
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    insertOrUpdate: function (context, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = { data: {} };
                context.commit('insertOrUpdate', __assign(__assign({}, payload), { result: result }));
                return [2 /*return*/, result.data];
            });
        });
    },
    delete: destroy$1,
    deleteAll: deleteAll$1
};

var OptionsBuilder = /** @class */ (function () {
    function OptionsBuilder() {
    }
    /**
     * Get persist options from the given payload.
     */
    OptionsBuilder.createPersistOptions = function (payload) {
        return {
            create: payload.create,
            insert: payload.insert,
            update: payload.update,
            insertOrUpdate: payload.insertOrUpdate
        };
    };
    return OptionsBuilder;
}());

/**
 * Delete records from the store. The actual name for this mutation is
 * `delete`, but named `destroy` here because `delete` can't be declared at
 * this scope level.
 */
function destroy$2(state, payload) {
    var entity = payload.entity;
    var where = payload.where;
    var result = payload.result;
    result.data = (new Query(state, entity)).delete(where);
}
/**
 * Delete all data from the store.
 */
function deleteAll$2(state, payload) {
    if (payload && payload.entity) {
        (new Query(state, payload.entity)).deleteAll();
        return;
    }
    Query.deleteAll(state);
}
var RootMutations = {
    /**
     * Execute generic mutation. This method is used by `Model.commit` method so
     * that user can commit any state changes easily through models.
     */
    $mutate: function (state, payload) {
        payload.callback(state[payload.entity]);
    },
    /**
     * Create new data with all fields filled by default values.
     */
    new: function (state, payload) {
        var entity = payload.entity;
        var result = payload.result;
        result.data = (new Query(state, entity)).new();
    },
    /**
     * Save given data to the store by replacing all existing records in the
     * store. If you want to save data without replacing existing records,
     * use the `insert` method instead.
     */
    create: function (state, payload) {
        var entity = payload.entity;
        var data = payload.data;
        var options = OptionsBuilder.createPersistOptions(payload);
        var result = payload.result;
        result.data = (new Query(state, entity)).create(data, options);
    },
    /**
     * Insert given data to the state. Unlike `create`, this method will not
     * remove existing data within the state, but it will update the data
     * with the same primary key.
     */
    insert: function (state, payload) {
        var entity = payload.entity;
        var data = payload.data;
        var options = OptionsBuilder.createPersistOptions(payload);
        var result = payload.result;
        result.data = (new Query(state, entity)).insert(data, options);
    },
    /**
     * Update data in the store.
     */
    update: function (state, payload) {
        var entity = payload.entity;
        var data = payload.data;
        var where = payload.where || null;
        var options = OptionsBuilder.createPersistOptions(payload);
        var result = payload.result;
        result.data = (new Query(state, entity)).update(data, where, options);
    },
    /**
     * Insert or update given data to the state. Unlike `insert`, this method
     * will not replace existing data within the state, but it will update only
     * the submitted data with the same primary key.
     */
    insertOrUpdate: function (state, payload) {
        var entity = payload.entity;
        var data = payload.data;
        var options = OptionsBuilder.createPersistOptions(payload);
        var result = payload.result;
        result.data = (new Query(state, entity)).insertOrUpdate(data, options);
    },
    delete: destroy$2,
    deleteAll: deleteAll$2
};

function use (plugin, options) {
    if (options === void 0) { options = {}; }
    var components = {
        Model: Model,
        Attribute: Attribute,
        Type: Type,
        Attr: Attr,
        String: String$1,
        Number: Number,
        Boolean: Boolean,
        Uid: Uid$1,
        Relation: Relation,
        HasOne: HasOne,
        BelongsTo: BelongsTo,
        HasMany: HasMany,
        HasManyBy: HasManyBy,
        BelongsToMany: BelongsToMany,
        HasManyThrough: HasManyThrough,
        MorphTo: MorphTo,
        MorphOne: MorphOne,
        MorphMany: MorphMany,
        MorphToMany: MorphToMany,
        MorphedByMany: MorphedByMany,
        Getters: Getters,
        Actions: Actions,
        RootGetters: RootGetters,
        RootActions: RootActions,
        RootMutations: RootMutations,
        Query: Query
    };
    plugin.install(components, options);
}

var ProcessStrategy = /** @class */ (function () {
    function ProcessStrategy() {
    }
    /**
     * Create the process strategy.
     */
    ProcessStrategy.create = function (model) {
        var _this = this;
        return function (value, _parentValue, _key) {
            _this.generateIds(value, model);
            _this.generateIndexId(value, model);
            return value;
        };
    };
    /**
     * Generate a field that is defined as primary keys. For keys with a proper
     * value set, it will do nothing. If a key is missing, it will generate
     * UID for it.
     */
    ProcessStrategy.generateIds = function (record, model) {
        var keys = Array.isArray(model.primaryKey) ? model.primaryKey : [model.primaryKey];
        keys.forEach(function (k) {
            if (record[k] !== undefined && record[k] !== null) {
                return;
            }
            var attr = model.getFields()[k];
            record[k] = attr instanceof Uid$1 ? attr.make() : Uid.make();
        });
    };
    /**
     * Generate index id field (which is `$id`) and attach to the given record.
     */
    ProcessStrategy.generateIndexId = function (record, model) {
        record.$id = model.getIndexIdFromRecord(record);
    };
    return ProcessStrategy;
}());

var Schema = /** @class */ (function () {
    /**
     * Create a new schema instance.
     */
    function Schema(model) {
        var _this = this;
        /**
         * List of generated schemas.
         */
        this.schemas = {};
        this.model = model;
        var models = model.database().models();
        Object.keys(models).forEach(function (name) { _this.one(models[name]); });
    }
    /**
     * Create a schema for the given model.
     */
    Schema.create = function (model) {
        return (new this(model)).one();
    };
    /**
     * Create a single schema for the given model.
     */
    Schema.prototype.one = function (model) {
        model = model || this.model;
        if (this.schemas[model.entity]) {
            return this.schemas[model.entity];
        }
        var schema$1 = new schema.Entity(model.entity, {}, {
            idAttribute: '$id',
            processStrategy: ProcessStrategy.create(model)
        });
        this.schemas[model.entity] = schema$1;
        var definition = this.definition(model);
        schema$1.define(definition);
        return schema$1;
    };
    /**
     * Create an array schema for the given model.
     */
    Schema.prototype.many = function (model) {
        return new schema.Array(this.one(model));
    };
    /**
     * Create an union schema for the given model.
     */
    Schema.prototype.union = function (callback) {
        return new schema.Union(this.schemas, callback);
    };
    /**
     * Create a dfinition for the given model.
     */
    Schema.prototype.definition = function (model) {
        var _this = this;
        var fields = model.getFields();
        return Object.keys(fields).reduce(function (definition, key) {
            var field = fields[key];
            if (field instanceof Relation) {
                definition[key] = field.define(_this);
            }
            return definition;
        }, {});
    };
    return Schema;
}());

var Builder = /** @class */ (function () {
    function Builder() {
    }
    /**
     * Create module from the given modules.
     */
    Builder.create = function (namespace, models, modules) {
        var tree = {
            namespaced: true,
            state: { $name: namespace },
            getters: RootGetters,
            actions: RootActions,
            mutations: RootMutations,
            modules: {}
        };
        return this.createModules(tree, namespace, models, modules);
    };
    /**
     * Creates module tree to be registered under top level module
     * from the given entities.
     */
    Builder.createModules = function (tree, namespace, models, modules) {
        var _this = this;
        Object.keys(modules).forEach(function (name) {
            var model = models[name];
            var module = modules[name];
            tree.modules[name] = { namespaced: true };
            tree.modules[name].state = _this.createState(namespace, name, model, module);
            tree.getters[name] = function (_state, getters, _rootState, _rootGetters) { return function () {
                return getters.query(name);
            }; };
            tree.modules[name].getters = __assign(__assign({}, Getters), module.getters);
            tree.modules[name].actions = __assign(__assign({}, Actions), module.actions);
            tree.modules[name].mutations = module.mutations || {};
        });
        return tree;
    };
    /**
     * Get new state to be registered to the modules.
     */
    Builder.createState = function (namespace, name, model, module) {
        var modelState = typeof model.state === 'function' ? model.state() : model.state;
        var moduleState = typeof module.state === 'function' ? module.state() : module.state;
        return __assign(__assign(__assign({}, modelState), moduleState), { $connection: namespace, $name: name, data: {} });
    };
    return Builder;
}());

var Database = /** @class */ (function () {
    function Database() {
        /**
         * The list of entities registered to the Vuex Store. It contains models and
         * modules with its name.
         */
        this.entities = [];
        /**
         * The database schema definition. This schema is going to be used when
         * normalizing the data before persisting them to the Vuex Store.
         */
        this.schemas = {};
    }
    /**
     * Initialize the database before a user can start using it.
     */
    Database.prototype.start = function (store, namespace) {
        this.store = store;
        this.namespace = namespace;
        this.registerModules();
        this.createSchema();
    };
    /**
     * Register a model and a module to Database.
     */
    Database.prototype.register = function (model, module) {
        if (module === void 0) { module = {}; }
        this.checkModelTypeMappingCapability(model);
        this.entities.push({
            name: model.entity,
            base: model.baseEntity || model.entity,
            model: model,
            module: module
        });
    };
    /**
     * Get the model of the given name from the entities list.
     */
    Database.prototype.model = function (name) {
        return this.models()[name];
    };
    /**
     * Get the base model of the given name from the entities list.
     */
    Database.prototype.baseModel = function (name) {
        return this.baseModels()[name];
    };
    /**
     * Get all models from the entities list.
     */
    Database.prototype.models = function () {
        return this.entities.reduce(function (models, entity) {
            models[entity.name] = entity.model;
            return models;
        }, {});
    };
    /**
     * Get all base models from the entities list.
     */
    Database.prototype.baseModels = function () {
        var _this = this;
        return this.entities.reduce(function (models, entity) {
            models[entity.name] = _this.model(entity.base);
            return models;
        }, {});
    };
    /**
     * Get the module of the given name from the entities list.
     */
    Database.prototype.module = function (name) {
        return this.modules()[name];
    };
    /**
     * Get all modules from the entities list.
     */
    Database.prototype.modules = function () {
        return this.entities.reduce(function (modules, entity) {
            modules[entity.name] = entity.module;
            return modules;
        }, {});
    };
    /**
     * Create the Vuex Module from the registered entities.
     */
    Database.prototype.registerModules = function () {
        var modules = Builder.create(this.namespace, this.models(), this.modules());
        this.store.registerModule(this.namespace, modules);
    };
    /**
     * Create the schema definition from registered entities list and set it to
     * the `schema` property. This schema will be used by the normalizer
     * to normalize data before persisting them to the Vuex Store.
     */
    Database.prototype.createSchema = function () {
        var _this = this;
        this.entities.forEach(function (entity) {
            _this.schemas[entity.name] = Schema.create(entity.model);
        });
    };
    /**
     * Warn user if the given model is a type of an inherited model that is being
     * defined without overwriting `Model.types()` because the user will not be
     * able to use the type mapping feature in this case.
     */
    Database.prototype.checkModelTypeMappingCapability = function (model) {
        // We'll not be logging any warning if it's on a production environment,
        // so let's return here if it is.
        /* istanbul ignore next */
        if (process.env.NODE_ENV === 'production') {
            return;
        }
        // If the model doesn't have `baseEntity` property set, we'll assume it is
        // not an inherited model so we can stop here.
        if (!model.baseEntity) {
            return;
        }
        // Now it seems like the model is indeed an inherited model. Let's check if
        // it has `types()` method declared, or we'll warn the user that it's not
        // possible to use type mapping feature.
        var baseModel = this.model(model.baseEntity);
        if (baseModel && baseModel.types === Model.types) {
            console.warn("Model " + model.name + " extends " + baseModel.name + " which doesn't overwrite Model.types(). You will not be able to use type mapping.");
        }
    };
    return Database;
}());

var index = {
    install: install,
    use: use,
    Container: Container,
    Database: Database,
    Model: Model,
    Attribute: Attribute,
    Type: Type,
    Attr: Attr,
    String: String$1,
    Number: Number,
    Boolean: Boolean,
    Uid: Uid$1,
    Relation: Relation,
    HasOne: HasOne,
    BelongsTo: BelongsTo,
    HasMany: HasMany,
    HasManyBy: HasManyBy,
    BelongsToMany: BelongsToMany,
    HasManyThrough: HasManyThrough,
    MorphTo: MorphTo,
    MorphOne: MorphOne,
    MorphMany: MorphMany,
    MorphToMany: MorphToMany,
    MorphedByMany: MorphedByMany,
    Getters: Getters,
    Actions: Actions,
    RootGetters: RootGetters,
    RootActions: RootActions,
    RootMutations: RootMutations,
    Query: Query
};

export default index;
export { Actions, Attr, Attribute, BelongsTo, BelongsToMany, Boolean, Container, Database, Getters, HasMany, HasManyBy, HasManyThrough, HasOne, Model, MorphMany, MorphOne, MorphTo, MorphToMany, MorphedByMany, Number, Query, Relation, RootActions, RootGetters, RootMutations, String$1 as String, Type, Uid$1 as Uid, install, use };
