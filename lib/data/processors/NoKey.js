var NoKey = /** @class */ (function () {
    function NoKey() {
        /**
         * Current no key value for the keys.
         */
        this.keys = {};
    }
    /**
     * Get no key class.
     */
    NoKey.prototype.self = function () {
        return this.constructor;
    };
    /**
     * Get current no key value for the given key.
     */
    NoKey.prototype.get = function (key) {
        return this.keys[key];
    };
    /**
     * Increment the count, then set new key to the keys.
     */
    NoKey.prototype.increment = function (key) {
        this.self().count++;
        this.keys[key] = "" + this.self().prefix + this.self().count;
        return this.keys[key];
    };
    /**
     * Count to create a unique id for the record that missing its primary key.
     */
    NoKey.count = 0;
    /**
     * Prefix string to be used for undefined primary key value.
     */
    NoKey.prefix = '_no_key_';
    return NoKey;
}());
export default NoKey;
//# sourceMappingURL=NoKey.js.map