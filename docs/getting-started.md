# Getting Started

This document is quick start guide to begin using Vuex ORM. It assumes you have a basic understanding of [Vuex](https://github.com/vuejs/vuex/). If you are not familiar with Vuex, please visit [Vuex Documentation](https://vuex.vuejs.org) to learn about Vuex.

## Core Architecture

Vuex ORM consists of following components.

- Database
- Model
- Module

You usually first create models and modules, then register them to the database. Then install the database to the Vuex as a plugin. After that, you may use them as if it is as ordinally Vuex Modules.

## Create Your Models

First, let's declare your models extending Vuex ORM `Model`. Here we assume that there are Post model and User model. Post model has a relationship with User – the post "belongs to" a user by `author` key.

```js
// User Model
import { Model } from 'vuex-orm'

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
import { Model } from 'vuex-orm'
import User from './User'

export default class Post extends Model {
  static entity = 'posts'

  static fields () {
    // `this.belongsTo` is for belongs to relationship.
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

With above example, you can see that the `author` field at `Post` model has a relation of `belongsTo` with `User` model.

You can learn more about Vuex ORM Models at [Model: Getting Started](model/getting-started.md)

## Create Your Modules

Next, you might want to create Vuex Module to register with models. However, the module could be an empty object.

```js
// users module
export default {}

// posts module
export default {}
```

### Register Models and Modules to the Vuex Store

Now it is time for you to register models and modules to the Vuex. To do so, register models to the new Database instance, and then register the database to Vuex Store as Vuex plugin.

Use `VuexORM.install` when registering VuexORM as a plugin.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM, { Database } from 'vuex-orm'
import User from './User'
import Post from './Post'
import users from 'users'
import posts from 'posts'

Vue.use(Vuex)

const database = new Database()

database.register(User, users)
database.register(Post, posts)

const store = new Vuex.Store({
  plugin: [VuexORM.install(database)]
})

export default store
```

Now you are ready to go. This is going to create `entities` module in Vuex Store. Which means you can access Vuex Store by `store.state.entities`.

### Changing The Namespace

By default, Vuex ORM creates a module named `entities` in Vuex Store. All modules and data handled by Vuex ORM are going to be stored under this namespace.

If you would like to change the module name, pass `namespace` option to the `install` method when registering Vuex ORM as a plugin.

```js
const store = Vuex.Store({
  plugins: [VuexORM.install(database, { namespace: 'my_entities' })
})
```

With above example, you can access the Vuex Store with `store.state.my_entities`.

## Creating Records to the Vuex Store

You can use `create` action to create a new record in Vuex Store. Let's say we want to save a single post data to the store.

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

store.dispatch('entities/posts/create', { data: posts })
```

With above action, Vuex ORM creates the following schema at Vuex Store.

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

See how `posts` and `users` decoupled from each other. This is what it means for "normalizing" the data.

## Accessing the Data

To access data, you may just access the store state directly as usual.

```js
store.state.entities.posts.data[1].title // <- 'Hello, world!'
store.state.entities.users.data[1].name  // <- 'John Doe'
```

However, Vuex ORM provides a way to query, and fetch data in an organized way through Vuex Getters.

```js
// Fetch all post records. The result will be wrapped with Post model!
store.getters['entities/posts/all']()

// [
//   Post { id: 1, user_id: 1, title: 'Hello, world!', body: 'Some awesome body...', author: 1 },
//   ...
// ]

// Fetch single record with relation.
store.getters['entities/posts/query']().with('author').first()

// Post {
//   id: 1,
//   user_id: 1,
//   title: 'Hello, world!',
//   body: 'Some awesome body...',
//   author: User {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com'
//   }
// }
```

Learn more about retrieving data from the Store at [Store: Retrieving Data](store/retrieving-data.md)
