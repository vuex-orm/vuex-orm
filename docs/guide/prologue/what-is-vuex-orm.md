# What is Vuex ORM?

Many APIs return JSON data that has deeply nested objects. Using data in this kind of structure can be very difficult for JavaScript applications, especially those using the single tree state management system such as [Vuex](https://vuex.vuejs.org) or [Redux](http://redux.js.org).

To nicely handle such "deeply nested objects", one approach is to split the nested data into separate modules and decouple them from each other. Simply put, it's kind of like treating a portion of your store as if it were a database, and keep that data in a normalized form.

[This is an excellent article](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) that describes the difficulty of nested data structures. It also explains how to design normalized state, and Vuex ORM is heavily inspired by it.

## What Is It Like To Use Vuex ORM

Here, let us show how it would look and feel like to be using Vuex ORM on your application.

Let's say you fetch posts data from a backend server. In most of the cases, the response would look something like below.

```js
const posts = [
  {
    id: 1,
    body: '......',
    author: { id: 1, username: 'user1', name: 'User 1' },
    comments: [
      {
        id: 1,
        author: { id: 2, username: 'user2', name: 'User 2' },
        comment: '.....'
      },
      {
        id: 2,
        author: { id: 2, username: 'user2', name: 'User 2' },
        comment: '.....'
      }
    ]
  },
  {
    id: 2,
    author: { id: 2, username: 'user2', name: 'User 2' },
    body: '......',
    comments: [
      {
        id: 3,
        author: { id: 3, username: 'user3', name: 'User 3' },
        comment: '.....'
      },
      {
        id: 4,
        author: { id: 1, username: 'user1', name: 'User 1' },
        comment: '.....'
      },
      {
        id: 5,
        author: { id: 3, username: 'user3', name: 'User 3' },
        comment: '.....'
      }
    ]
  }
  // and so on...
]
```

The data contains lots of `author` fields. Some of them are the exact same author. If you save this data to the store as is, it's going to be very hard to update the authors since there's going to be multiple, but the same author in the state.

When you store the above posts data using Vuex ORM, it will be "normalized" before saving them to the Vuex Store. After saving, Vuex Store State would look like below.

```js
// Storing data using The Model instance.
Post.insert({ data: posts })

// Or storing data using a Vuex action.
store.dispatch('entities/posts/insert', { data: posts })

// Then inside Vuex Store State becomes like this.
let state = {
  entities: {
    comments: {
      data: {
        '1': {
          id: 1,
          author: '2',
          comment: '.....'
        },
        '2': {
          id: 2,
          author: '2',
          comment: '.....'
        },
        '3': {
          id: 3,
          author: '3',
          comment: '.....'
        },
        '4': {
          id: 4,
          author: '1',
          comment: '.....'
        },
        '5': {
          id: 5,
          author: '3',
          comment: '.....'
        }
      }
    },

    posts: {
      data: {
        '1': {
          id: 1,
          body: '......',
          author: '1',
          comments: ['1', '2']
        },
        '2': {
          id: 2,
          author: ['2'],
          body: '......',
          comments: ['3', '4', '5']
        }
      }
    },

    users: {
      data: {
        '1': {
          id: 1,
          username: 'user1',
          name: 'User 1'
        },
        '2': {
          id: 2,
          username: 'user2',
          name: 'User 2'
        },
        '3': {
          id: 3,
          username: 'user3',
          name: 'User 3'
        }
      }
    }
  }
}
```

See how each data is now decoupled and deduplicated. This is what "normalize" means.

Now, you can fetch these data using a Model or Vuex Getters. These getters are also built in to Vuex ORM.

```js
// Fetch all posts using the Post model.
const posts = Post.all()
```

```js
// Fetch all posts using a Vuex getter.
const posts = store.getters['entities/posts/all']()

/*
  [
    { id: 1, body: "......" },
    { id: 2, body: "......" }
  ]
*/
```

```js
// Fetch all posts with its relation.
const posts = Post.query().with('author').get()

/*
  [
    {
      id: 1,
      body: "......",
      author: {
        id: 1,
        username: "user1",
        name: "User 1"
      }
    },
    {
      id: 2,
      body: "......",
      author: {
        id: 2,
        username: "user2",
        name: "User 2"
      }
    }
  ]
*/
```

```js
// Fetch data matching specific condition.
const posts = Post.query()
  .with('author')
  .where('id', 1) // Id of post.
  .get()

/*
  [
    {
      id: 1,
      body: "......",
      author: {
        id: 1,
        username: "user1",
        name: "User 1"
      }
    }
  ]
*/
```

Besides fetching data, Vuex ORM lets you create Model Classes for each data structure. When you retrieve data from the store, the records is actually a class instance.

```js
let state = {
  entities: {
    users: {
      data: {
        '1': {
          id: 1,
          first_name: 'John',
          last_name: 'Doe'
        }
      }
    }
  }
}
``` 

```js
// Define Model as class.
import { Model } from '@vuex-orm/core'

class User extends Model {
  fullName () {
    return this.first_name + ' ' + this.last_name
  }
}

// Fetch user from the store.
const user = User.find(1)

// The `user` is an instance of User class!
console.log(user.first_name) // John
console.log(user.last_name) // Doe
console.log(user.fullName()) // John Doe
```

Cool, isn't it? Are you ready to start using Vuex ORM? [Let's get started](getting-started.md).
