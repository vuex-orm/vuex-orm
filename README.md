# Vuex ORM

[![Travis CI](https://travis-ci.org/revolver-app/vuex-orm.svg?branch=master)](https://travis-ci.org/revolver-app/vuex-orm)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping like access to the Vuex Store. Heavily inspired by Redux recipe of ["Normalizing State Shape"](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) and ["Updating Normalized Data"](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html).

Vuex ORM lets you create "normalized" data schema within Vuex Store and provide fluent API to get, search and update Store state.

## Documentation

You can check out the full documentation for Vuex ORM at https://revolver-app.gitbooks.io/vuex-orm.

## Usage

### Create Your Models

First, let's declare your models extending Vuex ORM `Model`. Here we'll assume that there are Post model and User model. Post model has a relationship with User – the post "belongs to" a user by `author` key.

```js
// User Model
import Model from 'vuex-orm/lib/Model'

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
import Model from 'vuex-orm/lib/Model'
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

Next, you might want to create Vuex Module to register with models. However, the module could be an empty object.

```js
// users module
export default {}

// posts module
export default {}
```

### Register Models and Modules to the Vuex Store

Now it's time for you to register models and modules to the Vuex. To do so, you'll first have to register models to the Database and then register the database to Vuex Store as Vuex plugin.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from 'vuex-orm'
import Database from 'vuex-orm/lib/Database'
import User from './User'
import Post from './Post'
import users from 'users'
import posts from 'posts'

Vue.use(Vuex)

const database = new Database()

database.register(User, users)
database.register(Post, posts)

const store = new Vuex.Store({
  plugin: VuexORM(database)
})

export default store
```

Now you're ready to go. This is going to create `entities` module in Vuex Store. Which means you can access Vuex Store by `store.state.entities`.

### Creating Records to the Vuex Store

You can use `create` mutation to create a new record in Vuex Store. Let's say we want to save a single post data to the store.

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

store.commit('entities/create', { entity: 'posts', data: posts })
```

With above action, Vuex ORM will create the following schema at Vuex Store.

```js
// Inside `store.state.entities`.
{
  posts: {
    data: {
      1: {
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
      1: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  }
}
```

See how posts and users are decoupled from each other. This is what it means for "normalizing" the data.

### Accessing the Data

To access data, you may just access the store state directly as usual.

```js
store.state.entities.posts.data[1].title       // <- 'Hello, world!'
store.state.entities.posts.data[1].author.name // <- 'John Doe'
```

However, Vuex ORM provides a way to query, and fetch data in an organized way through Vuex Getters.

```js
// Fetch all post records. The result will be wrapped with Post model!
store.getters['entities/all']('posts')
// -> [
//   Post { id: 1, user_id: 1, title: 'Hello, world!', body: 'Some awesome body...', author: 1 },
//   ...
// ]

// Fetch single record with relation.
store.getters['entities/query']('posts').with('author').first()
// -> Post {
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

Cool right?

## Currently Available Relationship

Since Vuex ORM is under development, currently supported relationships are below.

- [x] hasOne
- [ ] hasMany
- [x] belongsTo
- [ ] hasAndBelongsToMany

## Contribution

We're really excited that you are interested in contributing to Vuex ORM! Anything from raising an issue, submitting an idea of a new feature, or making a pull request is welcome!

### Development

```console
$ npm run dev
```

Compile files without removing the compiled file first. This is useful when you are using `npm link` during development with other bundlers such as Webpack. Plus the watch mode is enabled.

```console
$ npm run build
```

Compile files into the lib directory.

```console
$ npm run lint
```

Lint files using a rule of Standard JS.

```console
$ npm run test
```

Run the test using [AVA](https://github.com/avajs/ava).

```console
$ npm run coverage
```

Generate test coverage.

## License

The Vuex ORM is open-sourced software licensed under the [MIT license](LICENSE.md).
