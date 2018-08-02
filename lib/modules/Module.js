var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import rootGetters from './rootGetters';
import rootActions from './rootActions';
import mutations from './mutations';
import subGetters from './subGetters';
import subActions from './subActions';
var Module = /** @class */ (function () {
    function Module() {
    }
    /**
     * The default state. This state will be merged with additional
     * entity's state if it has any.
     */
    Module.state = function () {
        return {
            $connection: '',
            $name: '',
            data: {}
        };
    };
    /**
     * Create module from the given entities.
     */
    Module.create = function (namespace, modules) {
        var tree = {
            namespaced: true,
            state: { $name: namespace },
            getters: rootGetters,
            actions: rootActions,
            mutations: mutations,
            modules: {}
        };
        return this.createTree(tree, namespace, modules);
    };
    /**
     * Creates module tree to be registered under top level module
     * from the given entities.
     */
    Module.createTree = function (tree, namespace, modules) {
        var _this = this;
        Object.keys(modules).forEach(function (name) {
            var module = modules[name];
            tree.getters[name] = function (_state, getters) { return function () {
                return getters.query(name);
            }; };
            tree.modules[name] = {
                namespaced: true,
                state: __assign({}, (typeof module.state === 'function' ? module.state() : module.state), _this.state(), { $connection: namespace, $name: name })
            };
            tree.modules[name]['getters'] = __assign({}, subGetters, module.getters);
            tree.modules[name]['actions'] = __assign({}, subActions, module.actions);
            tree.modules[name]['mutations'] = module.mutations || {};
        });
        return tree;
    };
    return Module;
}());
export default Module;
//# sourceMappingURL=Module.js.map