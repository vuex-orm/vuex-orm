---
sidebarDepth: 2
---

# Database

The Database holds all models and modules registered to Vuex ORM. It is also responsible for generating the database relational schema from the registered models. This schema is used to "Normalize" data before persisting to the Vuex Store.

In Vuex ORM, models may have relations with other models. To resolve those relations, models require some form of tracking in order to communicate with one another.

The Database is designed to track all registered models, build relational schema from those models, and register the database to the Vuex Store instance (contained in [Container](/api/container/container)).

The database instance can be accessed through the store instance, or [Container](/api/container/container).

```js
// Through the store instance.
this.$store.$db()

// Through the Container object.
import { Container } from '@vuex-orm/core'

Container.store.$db()
```


## Instance Properties

### `store`

- **Type**: `Vuex.Store`

  The Vuex Store instance.

### `namespace`

- **Type**: `string = 'entities'`

  The namespace of the Vuex Store module where all entities are registered under.
  
  The default namespace is `entities` and can be configured during setup.

- **See also**: [Changing the Namespace](/guide/model/database-registration.md#changing-the-namespace)

### `entities`

- **Type**: `Array<Object>`

  The collection of entities registered to the Vuex Store. It contains references to the models and corresponding modules.

### `schema`

- **Type**: `Object`

  The database schema definition. This schema is used when normalizing data before persisting it to the Vuex Store.


## Instance Methods

### `register`

- **Type**: `(model: Model, module: Object) => void`

  Register a model and a Vuex module to the Database.

  ```js
  const database = new Database()

  // With a Vuex module.
  database.register(User, users)

  // Without a Vuex module.
  database.register(User)
  ```

### `start`

- **Type**: `(store: Vuex.Store, namespace: string) => void`

  Generate Vuex Module and Normalizr schema tree from the registered models. This method is invoked when adding Vuex ORM to Vuex as a plugin.

### `model`

- **Type**: `(model: Model | string): Model`

  Get the model by entity from the entities list. If a model is passed as the argument, then the model [entity](/api/model/model.md#entity)  will be used.

  Throws an error if the model is not found.

  ```js
  const user = database.model('users')

  // User
  ```

### `models`

- **Type**: `() => Object`

  Get all models from the entities list. The result will be a plain object with key being the entity name for the model.

  ```js
  const models = database.model()

  // { users: User, posts: Post }
  ```

### `baseModel`

- **Type**: `(model: Model | string) => Model`

  Get the base model by entity from the entities list. If a model is passed as the argument, then the model [baseEntity](/api/model/model.md#baseentity)  will be used.
  
   The `baseModel` is only relevant when the model is inheriting another model to achieve Single Table Inheritance.
   
   Throws an error if the model is not found.
 
### `module`

- **Type**: `(name: string) => Vuex.Module`

  Get the module by entity from the entities list.

  Throws an error if the model is not found.

### `modules`

- **Type**: `() => Object`

  Get all modules from the entities list. The result will be a plain object with key being the entity name for the module.
