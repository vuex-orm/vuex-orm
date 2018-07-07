import Container from '../connections/Container';
import ModuleOptions from '../options/Options';
export default (function (database, options) {
    return function (store) {
        ModuleOptions.register(options);
        store.registerModule(ModuleOptions.namespace, database.createModule(ModuleOptions.namespace));
        database.registerStore(store);
        database.registerNamespace(ModuleOptions.namespace);
        Container.register(ModuleOptions.namespace, database);
        database.entities.forEach(function (entity) {
            entity.model.conf();
        });
    };
});
//# sourceMappingURL=install.js.map