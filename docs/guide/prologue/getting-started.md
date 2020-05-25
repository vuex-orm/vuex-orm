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

  // ...
}
```

You can learn more about Models at [Defining Models](../model/defining-models).

### Register Models to Vuex

Now it's time for you to register Models to Vuex. To do so, you should first register Models to Database instance, and then install Database to Vuex as a plugin through Vuex ORM `install` method.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from '@/models/User'
import Post from '@/models/Post'

Vue.use(Vuex)

// Create a new instance of Database.
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

Learn more about database registration at [Database Registration](../model/database-registration).

## Inserting Data

You may use the `insert` method from any Model you registered to insert a new record in Vuex Store. Let's say we want to save a single post data to the store. A simple Vue Component would look like this.

```vue
<script>
import Post from '@/models/Post'

export default {
  methods: {
    created () {
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

      Post.insert({ data: posts })
    }
  }
}
</script>
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

See how `posts` and `users` are decoupled from each other. This is what is meant by "normalizing" the data.

::: tip WHEN DOING SSR
You should import models through injected database instance when you're doing SSR like this; `this.$store.$db().model('users')`. Please check out the [Retrieve Models](../model/retrieving-models) section for the detail.
:::

## Retrieving Data

To retrieve inserted data, Vuex ORM provides a fluent [Query Builder](../data/retrieving.md#query-builder) for it. You may think of it as Vuex Getters with additional features added. You would want to retrieve data in `computed` property as you would do when using Vuex.

```vue
<template>
  <div>
    <article :key="post.id" v-for="post in posts">
      <h1>{{ post.title }}</h1>
      <p>{{ post.body }}</p>
    </article>
  </div>
</template>

<script>
import Post from '@/models/Post'

export default {
  computed: {
    posts () {
      // Fetch all post records.
      return Post.all()
    }
  }
}
</script>
```

Note that the above method will not include Users within returned posts. If you want to load any relationships, you can use `with` chain with the [Query Builder](../data/retrieving.md#query-builder).

```vue
<template>
  <div>
    <article :key="post.id" v-for="post in posts">
      <h1>{{ post.title }}</h1>
      <p>{{ post.body }}</p>
      <p>Author: {{ post.author.name }}</p>
    </article>
  </div>
</template>

<script>
import Post from '@/models/Post'

export default {
  computed: {
    posts () {
      // Fetch all post records with author.
      return Post.query().with('author').get()
    }
  }
}
</script>
```

## What's Next?

Vuex ORM offers a lot more features that help you deal with data. Please read through the documentation to find out more. Here are some good starting points to go from here.

- [Defining Models](/guide/model/defining-models.md)
- [Inserting and Updating Data](/guide/data/inserting-and-updating.md)
- [Retrieving Data](/guide/data/retrieving.md)
- [Deleting Data](/guide/data/deleting.md)

