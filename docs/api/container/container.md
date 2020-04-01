---
sidebarDepth: 2
---

# Container

The Container holds the Vuex Store instance. The only purpose of the Container is to hold store instance so that it can be used throughout the library. It is tightly coupled with the [Database](/api/database/database) instance.

## Static Properties

### `store`

- **Type**: `Vuex.Store`

  The store instance that Vuex ORM is being installed.

## Static Methods

### register

- **Type**: `(store: Vuex.Store) => void`

  Register a store instance to the Container.

  ```js
  Container.register(new Vuex.Store())
  ```

  This method is called during the Vuex plugin installation.
