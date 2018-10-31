# Getting Started

This document is a quick start guide to begin using Vuex ORM. It assumes you have a basic understanding of [Vuex](https://github.com/vuejs/vuex/). If you are not familiar with Vuex, please visit [Vuex Documentation](https://vuex.vuejs.org) to learn about Vuex.

> **NOTE:** We will be using ES2015 syntax for code examples for the rest of the docs. Also, we use "Class Property" to define some property in the class. This syntax requires compilers such as [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties).

## Core Architecture

To setup Vuex ORM, you must first create the following components.

- Models
- Modules
- Database

You usually first create models and modules, then register them to the database. Finally, install the database to Vuex as a plugin.

## Create Models

Models represent schema of the data which is going to be stored in the Vuex Store. The schema would often be the same as the API response from the server, but it could be whatever you like.

Models can also have relationships with other models like any other ORM library. For example, a post belongs to a user, or post has many comments.

Let's declare models by extending Vuex ORM `Model`.

```js
// User Model
import { Model } from '@vuex-orm/core'

export default class User extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'users'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      email: this.attr(''),
    }
  }
}


// Post Model
import { Model } from '@vuex-orm/core'
import User from './User'

export default class Post extends Model {
  static entity = 'posts'

  static fields () {
    // `this.belongsTo` is for belongs to relationship. The first argument
    // is the Model class, and second is the foreign key.
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      title: this.attr(''),
      body: this.attr(''),
      published: this.attr(false),
      author: this.belongsTo(User, 'user_id')
    }
  }
}
```

The above example shows that there are `User` Model and `Post` Model. `Post` Model has `belongsTo` relationship to User at `author` key.

If you don't want use the "Class Property" syntax such as `static entity`, you can define them differently too.

```js
class User extends Model {
  // ...
}

User.entity = 'users'

// Or...

class User extends Model {
  static get entity () {
    return 'users'
  }

  // ...
}
```

You can learn more about Models at [Models](../components/models.md).

## Create Modules

Modules are just simple [Vuex Modules](https://vuex.vuejs.org/en/modules.html) that correspond to the Models. Vuex ORM uses this module to interact with the Vuex Store.

Vuex ORM is going to add any necessary states, getters, actions, and mutations, so you do not have to add anything to the modules, but if you want you can. When you do, just treat them as standard Vuex Modules.

```js
// The users module. If you don't need any specific features, you can leave it
// as an empty object, or just don't create any.
export default {}

// The posts module. You can add any additional things you want.
export default {
  state: {
    fetched: false
  },

  actions: {
    fetch ({ commit }) {
      commit('fetch')
    }
  },

  mutations: {
    fetch (state) {
      state.fetched = true
    }
  }
}
```

You may learn more about modules at [Modules And Store](../components/modules-and-store.md).

### Register Models and Modules to the Vuex Store

Now it is time for you to register Models and Modules to the Vuex. To do so, register Models and Modules you have created to the Database instance, and then register the Database to the Vuex Store as a Vuex plugin.

Use `install` when registering VuexORM as a plugin.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from './User'
import Post from './Post'
import users from './users'
import posts from './posts'

Vue.use(Vuex)

// Create new instance of Database.
const database = new VuexORM.Database()

// Register Model and Module. The First argument is the Model, and
// second is the Module.
database.register(User, users)
database.register(Post, posts)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})

export default store
```

Now you are ready to go. Vuex ORM is going to create an `entities` module in Vuex Store State, and register any other modules under the `entities` namespace.

The state tree inside Vuex Store is going to be as follows.

```js
store.state.entities

/*
  {
    entities: {
      posts: {
        data: {}
      },
      users: {
        data: {}
      }
    }
  }
*/
```

Learn more about plugin registration at [Database And Registration](../components/database-and-registration.md).

## Creating Data to Vuex Store

You can use the `create` action to create a new record in Vuex Store. Let's say we want to save a single post data to the store.

```js
// Assuming this data structure is the response from the API backend.
const posts = [
  {
    id: 1,
    title: 'Hello, world!',
    body: 'Some awesome body...',
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
}

Post.create({ data: posts })
```

With above action, Vuex ORM creates the following schema in the Vuex Store.

```js
// Inside `store.state.entities`.
{
  posts: {
    data: {
      '1': {
        id: 1,
        user_id: 1,
        title: 'Hello, world!',
        body: 'Some awesome body...',
        author: 1
      }
    }
  },

  users: {
    data: {
      '1': {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  }
}
```

See how `posts` and `users` are decoupled from each other. This is what is meant by "normalizing" the data.

## Retrieving Data from Vuex Store

To retrieve data, you can just access the store state directly as usual.

```js
store.state.entities.posts.data[1].title // <- 'Hello, world!'
store.state.entities.users.data[1].name // <- 'John Doe'
```

However, Vuex ORM provides a way to query, and fetch data in an organized way through Vuex Getters.

```js
// Fetch all post records. The result will be wrapped with Post model!
Post.all()

/*
  [
    Post { id: 1, user_id: 1, title: 'Hello, world!', body: 'Some awesome body...', author: 1 },
    Post { id: 2, user_id: 2, title: 'Hello, another world!', body: 'Some another awesome body...', author: 2 },
    ...
  ]
*/

// Fetch single record with relation.
Post.query().with('author').first()

/*
  Post {
    id: 1,
    user_id: 1,
    title: 'Hello, world!',
    body: 'Some awesome body...',
    author: User {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
*/
```

Learn more about retrieving data from the Store at [Store: Retrieving Data](../store/retrieving-data.md)
