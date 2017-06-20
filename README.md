# Vuex ORM

[![Travis CI](https://travis-ci.org/revolver-app/vuex-orm.svg?branch=master)](https://travis-ci.org/revolver-app/vuex-orm)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping like access to the Vuex Store. Heavily inspired by Redux recipe of ["Normalizing State Shape"](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) and ["Updating Normalized Data"](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html).

Basically, what is does is create "normalized" data schema within Vuex Store and let you access, or modify those data through model classes.

## Usage

### Create Your Models

First let's declare your models extending Vuex ORM `Model`. Here we'll assume we have the Post model and User model. Post model has a relationship with User – the post "belongs to" a user.

```js
// User Model
import Model from 'vuex-orm/lib/Model'

export default class User extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'users'

  // List all of the fields of the post.
  static fields () {
    return {
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
    return {
      title: this.attr(''),
      body: this.attr(''),
      published: this.attr(false),
      author: this.belongsTo(User, 'user_id')
    }
  }
}
```

With above example, you can see that the `author` field at `Post` model has relation of `belongsTo` with `User` model.

### Register Models to the Vuex Store

Now it's time for you to register models to the Vuex Store. To do so, first you'll have to register models to the Database, and then register the database to Vuex Store as Vuex plugin.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from 'vuex-orm'
import Database from 'vuex-orm/lib/Database'
import User from './User'
import Post from './Post'

Vue.use(Vuex)

const database = new Database()

database.register(User)
database.register(Post)

const store = new Vuex.Store({
  plugin: VuexORM(database)
})

export default store
```

Now you're ready to go. This is going to create `entities` module in Vuex Store. Which means you can access Vuex Store by `store.state.entities`.

### Creating Records to the Vuex Store

You can use `make` action or mutation to create new record in Vuex Store. Let's say we want save a single post data to the store.

```js
// This data structure is mostly the response from the API backend.
const data = {
  id: 1,
  title: 'Hello, world!',
  body: 'Some awesome body...',
  author: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  }
}

store.dispatch('entities/posts/make', { data })
```

With above action, Vuex ORM will create following schema at Vuex Store.

```js
// Inside `store.state.entities`.
{
  posts: {
    data: {
      1: {
        id: 1,
        title: 'Hello, world!',
        body: 'Some awesome body...'
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

See how posts and users are decoupled from each other. This is what it means by "normalizing" the data.

### Accessing the Data

To access data, there are no special things you have to do. Just access the data as if it was a plain Vuex Store. But, Vuex ORM let's you access relational data as if the was nested as well!

```js
store.state.entities.posts.data[1].title       // <- 'Hello, world!'
store.state.entities.posts.data[1].author.name // <- 'John Doe'
```

Cool right?

## Currently Available Relationship

Since Vuex ORM is under development, currently supported relationships are below.

- [ ] hasOne
- [ ] hasMany
- [x] belongsTo
- [ ] hasAndBelongsToMany

## Contribution

We're really excited that you are interested in contributing to Vuex ORM! Anything from raising an issue, submitting idea of a new feature, or making a pull request is welcome!

### Development

```console
$ npm run dev
```

Compile files without removing the compiled file first. This is useful when you are using `npm link` during development with other bundler such as Webpack. Plus it's watch mode enabed.

```console
$ npm run build
```

Compile files into lib directory.

```console
$ npm run lint
```

Lint files using rule of Standard JS.

```console
$ npm run test
```

Run the test using [AVA](https://github.com/avajs/ava).

## License

The Vuex ORM is open-sourced software licensed under the MIT license.
