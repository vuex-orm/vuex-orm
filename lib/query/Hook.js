var Hook = /** @class */ (function () {
    /**
     * Create a lidecycle hook instance.
     */
    function Hook(query) {
        this.query = query;
    }
    /**
     * Register a callback. It Returns unique ID for registered callback.
     */
    Hook.on = function (on, callback, once) {
        if (once === void 0) { once = false; }
        var uid = this.lastHookId + 1;
        this.lastHookId = uid;
        if (!this.hooks[on]) {
            this.hooks[on] = [];
        }
        this.hooks[on].push({ callback: callback, once: once, uid: uid });
        return uid;
    };
    /**
     * Remove hook registration.
     */
    Hook.off = function (uid) {
        var _this = this;
        var removed = false;
        Object.keys(this.hooks).some(function (on) {
            var hook = _this.hooks[on];
            var index = hook.findIndex(function (h) { return h.uid === uid; });
            if (index !== -1) {
                hook.splice(index, 1);
                removed = true;
            }
            return removed;
        });
        return removed;
    };
    /**
     * Get the hook class.
     */
    Hook.prototype.self = function () {
        return this.constructor;
    };
    /**
     * Get the action hook.
     */
    Hook.prototype.getActionHook = function (name) {
        if (!this.query.actionContext) {
            return null;
        }
        var hook = this.query.module.actions && this.query.module.actions[name];
        return hook || null;
    };
    /**
     * Get the global hook.
     */
    Hook.prototype.getGlobalHook = function (name) {
        if (!this.self().hooks[name]) {
            return null;
        }
        return this.self().hooks[name];
    };
    /**
     * Check if the given hook exist.
     */
    Hook.prototype.has = function (name) {
        return !!this.getActionHook(name) || !!this.getGlobalHook(name);
    };
    /**
     * Execute the callback of the given hook.
     */
    Hook.prototype.execute = function (on, data) {
        if (!this.has(on)) {
            return data;
        }
        data = this.executeActionHook(on, data);
        data = this.executeGlobalHook(on, data);
        return data;
    };
    /**
     * Execute the action hook.
     */
    Hook.prototype.executeActionHook = function (on, data) {
        if (!this.query.actionContext) {
            return data;
        }
        var hook = this.getActionHook(on);
        if (!hook) {
            return data;
        }
        var result = hook(this.query.actionContext, data);
        if (result === false) {
            return false;
        }
        return result || data;
    };
    /**
     * Execute the global callback of the given hook.
     */
    Hook.prototype.executeGlobalHook = function (on, data) {
        var _this = this;
        if (data === false) {
            return false;
        }
        var hooks = this.getGlobalHook(on);
        if (!hooks) {
            return data;
        }
        // Track indexes to delete.
        var deleteHookIndexes = [];
        // Loop all hooks.
        hooks.forEach(function (hook, hookIndex) {
            var callback = hook.callback, once = hook.once;
            data = callback.call(_this.query, data, _this.query.entity);
            // Add hook index to delete.
            once && deleteHookIndexes.push(hookIndex);
        });
        // Remove hooks to be deleted in reverse order.
        deleteHookIndexes.reverse().forEach(function (hookIndex) {
            hooks.splice(hookIndex, 1);
        });
        return data;
    };
    /**
     * Execute the callback for all given records.
     */
    Hook.prototype.executeOnRecords = function (on, records) {
        var _this = this;
        if (!this.has(on)) {
            return records;
        }
        return Object.keys(records).reduce(function (newRecords, id) {
            var record = records[id];
            var result = _this.execute(on, record);
            if (result === false) {
                return newRecords;
            }
            newRecords[id] = result;
            return newRecords;
        }, {});
    };
    /**
     * Execute the callback for the given collection.
     */
    Hook.prototype.executeOnCollection = function (on, collection) {
        var _this = this;
        if (!this.has(on)) {
            return collection;
        }
        collection.map(function (item) { _this.execute(on, item); });
        return collection;
    };
    /**
     * Global lifecycle hooks for the query.
     */
    Hook.hooks = {};
    /**
     * Hook UID counter.
     */
    Hook.lastHookId = 0;
    return Hook;
}());
export default Hook;
//# sourceMappingURL=Hook.js.map