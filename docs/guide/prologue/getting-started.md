# Getting Started

This page is a quick start guide to begin using Vuex ORM. It assumes you have a basic understanding of [Vuex](https://github.com/vuejs/vuex/). If you are not familiar with Vuex, please visit [Vuex Documentation](https://vuex.vuejs.org) to learn about Vuex.

> **NOTE:** We will be using ES2015 syntax for code examples for the rest of the docs. Also, we use "Class Property" to define some property in the class. This syntax requires compilers such as [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties).

## Setup

To setup Vuex ORM, you must:

1. Define Models.
2. Register Models to Vuex.

Don't worry. It's much easier than you think.

### Define Models

Models represent schema of the data which is going to be stored in the Vuex Store. The schema would often be similar to the API response from the server, but it could be whatever you like.

Models can also have relationships with other models like any other ORM library. For example, a Post could *belongs to* a User, or Post *has many* Comments.

You can declare models by extending Vuex ORM `Model`.

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
      email: this.attr('')
    }
  }
}
```

```js
// Post Model

import { Model } from '@vuex-orm/core'
import User from './User'

export default class Post extends Model {
  static entity = 'posts'

  // `this.belongsTo` is for belongs to relationship. The first argument is
  // the Model class, and second is the field name for the foreign key.
  static fields () {
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

By the way, if you don't want to use the "Class Property" syntax such as `static entity`, you can define them differently too.

```js
// Assign property afterwords.

class User extends Model {
  // ...
}

User.entity = 'users'
```

```js
// Assign static property as a getter.

class User extends Model {
  static get entity () {
    return 'users'
  }
}
```

You can learn more about Models at [Defining Models](../components/models.md).

### Register Models to Vuex

Now it's time for you to register Models to Vuex. To do so, you should first register Models to Database instance, and then install Database to Vuex as a plugin through Vuex ORM `install` method.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from './User'
import Post from './Post'

Vue.use(Vuex)

// Create new instance of Database.
const database = new VuexORM.Database()

// Register Models to Database.
database.register(User)
database.register(Post)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})

export default store
```

Now you are ready to go. Vuex ORM is going to create an `entities` module in Vuex Store State by default, and register any Models under the `entities` namespace. The state tree inside Vuex Store is going to be as follows.

```js
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
```

Learn more about plugin registration at [Database Registration](../components/database-and-registration.md).

## Inserting Data

You may use the `insert` method to insert a new record in Vuex Store. Let's say we want to save a single post data to the store.

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

// import the Post model class
import Post from './Post'

Post.insert({ data: posts })
```

With above action, Vuex ORM creates the following schema in the Vuex Store.

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

See how `posts` and `users` are decoupled from each other. This is what is meant by "normalizing" the data.

## Retrieving Data

```js

// import the Post model
import Post from './Post'

// Fetch all post records. The result will be wrapped with Post model.
Post.all()

/*
  [
    {
      id: 1,
      user_id: 1,
      title: 'Hello, world!',
      body: 'Some awesome body...',
    },
    {
      id: 2,
      user_id: 2,
      title: 'Hello, another world!',
      body: 'Some another awesome body...'
    }
  ]
*/
```

```js
// Fetch single post with `author`.
Post.query().with('author').first()

/*
  {
    id: 1,
    user_id: 1,
    title: 'Hello, world!',
    body: 'Some awesome body...',
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
*/
```

## What's Next?

Vuex ORM offers a lot more features that help you deal with data. Please read through the documentation to find out more. Here are some good starting points to go from here.

- [Defining Models]()
- [Inserting and Updating Data]()
- [Retrieving Data]()
- [Deleting Data]()
