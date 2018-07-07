import Module from '../modules/Module';
var Database = /** @class */ (function () {
    function Database() {
        /**
         * The list of entities to be registered to the Vuex Store. It contains
         * models and modules with its name.
         */
        this.entities = [];
    }
    /**
     * Register a model and module to the entities list.
     */
    Database.prototype.register = function (model, module) {
        this.entities.push({
            name: model.entity,
            model: model,
            module: module
        });
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
     * Create the Vuex Module from registered entities.
     */
    Database.prototype.createModule = function (namespace) {
        return Module.create(namespace, this.modules());
    };
    /**
     * Register a Vuex Store instance.
     */
    Database.prototype.registerStore = function (store) {
        this.store = store;
    };
    /**
     * Register namespace to the all regitsered model.
     */
    Database.prototype.registerNamespace = function (namespace) {
        this.entities.forEach(function (entity) { entity.model.connection = namespace; });
    };
    return Database;
}());
export default Database;
//# sourceMappingURL=Database.js.map