# Database Registration

To register defined Models to Vuex store, you must first create a Database, register Models to Database, and then register the Database to the Vuex with the Vuex ORM `install` method.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from './User'
import Post from './Post'

Vue.use(Vuex)

// Create new instance of Database.
const database = new VuexORM.Database()

// Register Models.
database.register(User)
database.register(Post)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})

export default store
```

## Changing the Namespace

By default, Vuex ORM creates a module named `entities` in the Vuex Store. All Models and data handled by Vuex ORM will be stored under this namespace.

If you would like to change the module name, pass the `namespace` option to the `install` method when registering Vuex ORM as a plugin.

```js
const store = Vuex.Store({
  plugins: [VuexORM.install(database, { namespace: 'database' })]
})
```

With the above example, you can access the Vuex Store with `store.state.database`.
