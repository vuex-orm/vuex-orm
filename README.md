# Vuex ORM

[![Travis CI](https://travis-ci.org/vuex-orm/vuex-orm.svg?branch=master)](https://travis-ci.org/vuex-orm/vuex-orm)
[![codecov](https://codecov.io/gh/vuex-orm/vuex-orm/branch/master/graph/badge.svg)](https://codecov.io/gh/vuex-orm/vuex-orm)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License](https://img.shields.io/npm/l/vue.svg)](https://github.com/vuex-orm/vuex-orm/blob/master/LICENSE.md)

Vuex ORM is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping like access to the Vuex Store. Heavily inspired by Redux recipe of ["Normalizing State Shape"](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) and ["Updating Normalized Data"](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html).

Vuex ORM lets you create "normalized" data schema within Vuex Store with relationships like any other usual ORM library. It also provides fluent API to get, search and update Store state.

Learn more about the concept and motivation of Vuex ORM at [What Is Vuex ORM?](https://vuex-orm.gitbooks.io/vuex-orm/what-is-vuex-orm.html).

> **IMPORTANT NOTICE:** As of Vuex ORM 0.16.0, the package has moved to `@vuex-orm/core` from `vuex-orm`. If you were using Vuex ORM before 0.15.0, please update the package name of your `package.json` to `@vuex-orm/core`.

## Documentation

You can check out the full documentation for Vuex ORM at https://vuex-orm.gitbooks.io/vuex-orm.

## Examples

You can find example application built with Vuex ORM [at here](https://github.com/vuex-orm/vuex-orm-examples).

## Quick Start

### Install Vuex ORM

You can install Vuex ORM via npm.

```console
$ npm install vuex-orm
```

### Create Your Models

First, let's declare your models extending Vuex ORM `Model`. Here we assume that there are Post model and User model. Post model has a relationship with User – the post "belongs to" a user by `author` key.

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
import { Model } from ''@vuex-orm/core'
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

### Create Your Modules

Next, you might want to create Vuex Module to register with models. Modules are just simple [Vuex Module](https://vuex.vuejs.org/en/modules.html) that correspond to the Models. Vuex ORM uses this module to interact with Vuex Store.

Vuex ORM is going to add any necessary states, getters, actions, and mutations, so you do not have to add anything to the modules, but if you want you can. When you do, just treat them as standard Vuex Module.

```js
// The users module. If you do not need any specific features, you can
// leave it as an empty object.
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

### Register Models and Modules to the Vuex Store

Now it is time for you to register models and modules to the Vuex. To do so, you first have to register models to the Database and then register the database to Vuex Store as Vuex plugin using VuexORM's `install` method.

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

Now you are ready to go. Vuex ORM is going to create `entities` module in Vuex Store. Which means you can access Vuex Store by `store.state.entities`.

### Creating Records to the Vuex Store

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
]

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

### Accessing the Data

To access data, you may just access the store state directly as usual.

```js
store.state.entities.posts.data[1].title // <- 'Hello, world!'
store.state.entities.users.data[1].name  // <- 'John Doe'
```

However, Vuex ORM provides a way to query, and fetch data in an organized way through Vuex Getters.

```js
// Fetch all post records. The result will be the instance of Post model!
store.getters['entities/posts/all']()

// [
//   Post { id: 1, user_id: 1, title: 'Hello, world!', body: 'Some awesome body...', author: 1 },
//   ...
// ]

// Fetch single record with relation.
store.getters['entities/posts/query']().with('author').first(1)

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

Cool right? To get to know more about Vuex ORM, please [see the documentation](https://vuex-orm.gitbooks.io/vuex-orm)

## Contribution

We are excited that you are interested in contributing to Vuex ORM! Anything from raising an issue, submitting an idea of a new feature, or making a pull request is welcome!

### Development

```console
$ npm run build
```

Compile files and generate bundles in `dist` directory.

```console
$ npm run lint
```

Lint files using a rule of Standard JS.

```console
$ npm run test
```

Run the test using [Mocha Webpack](https://github.com/zinserjan/mocha-webpack).

```console
$ npm run coverage
```

Generate test coverage in `coverage` directory.

## License

The Vuex ORM is open-sourced software licensed under the [MIT license](LICENSE.md).
