import Connection from './Connection';
var Container = /** @class */ (function () {
    function Container() {
    }
    /**
     * Create a connection instance and registers it to the connections list.
     */
    Container.register = function (name, database) {
        this.connections[name] = new Connection(database);
    };
    /**
     * Find connection with the given from the connection list.
     */
    Container.connection = function (name) {
        return this.connections[name];
    };
    /**
     * A list of connections that have been registered to the Vuex Store.
     */
    Container.connections = {};
    return Container;
}());
export default Container;
//# sourceMappingURL=Container.js.map