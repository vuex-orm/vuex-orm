---
sidebarDepth: 2
---

# Container

The Container is the global object that holds Vuex Store instance. The only purpose of the Container is to hold store instance so that we can use it in other places. Please refer to [Database](/api/database/database) to see why we need this global object in the first place.

## Static Properties

### store

- **`static store: Vuex.Store<any>`**

  The store instance that Vuex ORM is being installed.

## Static Methods

### register

- **`static register(store: Vuex.Store<any>): void`**

  Register a store instance to the Container.

  ```js
  Container.register(store)
  ```

  This method is called during the Vuex plugin installation, so usually, you would never have to use this method.
