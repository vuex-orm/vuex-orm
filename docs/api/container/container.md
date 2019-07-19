---
sidebarDepth: 2
---

# Container

The Container is the global object that holds [Database](/api/database/database) instance. The only purpose of the Container is to store Database instance so that we can use it in other places. Please refer to [Database](/api/database/database) to see why we need this global object in the first place.

## Static Properties

### database

- **`static database: Database`**

  The database instance that have been registered to the Vuex Store.

## Static Methods

### register

- **`static register(database: Database): void`**

  Register a Database instance to the Container.

  ```js
  Container.register(database)
  ```

  This method is called during the Vuex plugin installation, so usually, you would never have to use this method.
