---
sidebarDepth: 2
---

# Database

The Database is the object that holds all Models and Modules that are registered to the Vuex ORM. It is also responsible for generating the whole database relational schema from registered models. This schema is used to "Normalize" data before persisting to the Vuex Store.

When using Vuex ORM, you will unlikely need to use the Database class after it's registered to the Vuex Store. But for those who are curious, we'll describe why the Database object exists in the first place.

In Vuex ORM, any Model can have any type of relationship with other Models. To resolve those relationships, we need to store all Models somewhere so that a Model can reference each other. That's where the Database comes in to play. You can get any registered Model like this.

```js
const database = new Database()

database.register(User)

const user = database.model('users')
```

You might wonder why do we need to store all Models in one place since the related Models are passed at Model when defining relationships like below.

```js
import { Model } from '@vuex-orm/core'
import Post from './Post'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      posts: this.hasMany(Post, 'user_id')  // <- Passing related Model.
    }
  }
}
```

So, can't we just resolve relationship directly from the Model? Unfortunately no, we can't. The primary reason is that Vuex ORM is built on top of Vuex, and Vuex ORM is calling Vuex Getters/Actions/Mutations to interact with the Vuex Store. In fact, you can call Vuex Actions directly to create or fetch data.

Vuex Module doesn't have access to Model. It must resolve the Model from the entity name, which is a `string`. When a user calls actions like `store.dispatch('entities/users/insert', { ... })`, we must somehow get User Model by the namespace, which is `users` in `entities/users/insert`. Well, Vuex ORM actions are getting Models from the Database.

Finally, the created Database instance is registered to the Vuex Store instance, then it's registered to the [Container](../container/container) so we have access to it from everywhere.

You can access the database instance through the store instance, or Container.

```js
// Through the store instance.
this.$store.$db()

// Through the Container object.
import { Container } from '@vuex-orm/core'

Container.store.$db()
```

## Instance Properties

### store

- **`store!: Vuex.Store<any>`**

  The Vuex Store instance.

### namespace

- **`namespace!: string`**

  The namespace of the Vuex Store Module where all entities are registered under. the default is `entities`.

### entities

- **`entities: Entity[] = []`**

  The list of entities registered to the Vuex Store. It contains models and modules with its name. The Entity interface looks like below.

  ```ts
  interface Entity {
    name: string
    base: string
    model: typeof Model
    module: Vuex.Module<any, any>
  }
  ```

### schema

- **`schemas: Schemas = {}`**

  The database schema definition. This schema is going to be used when normalizing the data before persisting them to the Vuex Store. Schemas interface is a list of Normalizr schema.

  ```ts
  interface Schemas {
    [entity: string]: NormalizrSchema.Entity
  }
  ```

## Instance Methods

### register

- **`register(model: typeof Model, module: Vuex.Module<any, any> = {}): void`**

  Register a model and a module to Database.

  ```js
  database.register(User, users)
  ```

  You can omit registering a module.

  ```js
  database.register(User)
  ```

### start

- **`start (store: Vuex.Store<any>, namespace: string): void`**

  This method will generate Vuex Module and Normalizr schema tree from the registered Models. It will be called when adding Vuex ORM to Vuex as a plugin.

### model

- **`model<T extends typeof Model>(model: T): T`**<br>
  **`model(model: string): typeof Model`**

  Get the model of the given name from the entities list. It is going to through error if the model was not found.

  ```js
  const user = database.model('users')

  // User
  ```

### models

- **`models (): { [name: string]: typeof Model }`**

  Get all models from the entities list. The result will be object with key being the entity name for the Model.

  ```js
  const models = database.model()

  // { users: User, posts: Post }
  ```

### baseModel

- **`baseModel<T extends typeof Model>(model: T): T`**<br>
  **`baseModel(model: string): typeof Model`**

  Get the base model of the given name from the entities list. The base Model is only relevant when the model is inheriting another model to achieve Single Table inheritance feature. It is going to through error if the model was not found.
 
### module

- **`module (name: string): Vuex.Module<any, any>`**

  Get the module of the given name from the entities list. It is going to through error if the module was not found.

### modules

- **`modules (): { [name: string]: Vuex.Module<any, any> }`**

  Get all modules from the entities list. The result will be object with key being the entity name for the Module.
