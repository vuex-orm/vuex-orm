# Modules and Store

Modules are simple [Vuex Modules](https://vuex.vuejs.org/en/modules.html) that correspond to the Models. Vuex ORM will use modules to interact with Vuex Store. Vuex ORM will register predefined state, getters, actions, and mutations for interacting with store easily. However, you are free to add any additional modules you wish.

## Defining Modules

Vuex ORM doesn't require defining any specific module. You can leave them empty, or even not to create any when registering to the database.

```js
// users module.
const users = {}

database.register(User, users)

// Or just omit passing module.
database.register(User)
```

However, you may add additional state, getters, actions, and mutations.

```js
const users = {
  state = {
    count: 0
  },

  mutations: {
    add (state, count) {
      state.count = state.count + count
    }
  }
}

database.register(User, users)
```

> **WARNING:** Do not create state named `data`. The key name `data` is reserved, and Vuex ORM will override its value when storing data.

## Inside Store

Vuex ORM will create the schema based on registered models inside the Vuex Store. For example, when you install Vuex ORM with User and Post model, the inside of the Vuex Store would become:

```js
class User extends Model {
  static entity = 'users'
}

class Post extends Model {
  static entity = 'posts'
}

store.state

/*
  {
    entities: {
      users: {
        data: {}
      },
      posts: {
        data: {}
      }
    }
  }
*/
```

## Interacting With Store

You may interact with the Store as you ordinally would with Vuex. If you have defined some additional state, getters, actions, and mutations, you can call them through the Vuex Module syntax.

```js
const users = {
  state = {
    count: 0
  },

  mutations: {
    add (state, count) {
      state.count = state.count + count
    }
  }
}

// Get state.
const count = store.state.users.count

// Commit mutation.
store.commit('entities/users/add', 3)
```

However, Vuex ORM has predefined getters, actions, and mutations to store, modify and search data. See [Interacting With Store](../store/retrieving-data.md) for their usage.
