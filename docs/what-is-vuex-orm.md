# What Is Vuex ORM?

Many APIs return JSON data that has deeply nested objects. Using data in this kind of structure can be very difficult for JavaScript applications, especially those using the single tree state management system such as [Vuex](https://vuex.vuejs.org) or [Redux](http://redux.js.org).

To nicely handle such "deeply nested objects", one approach is to split those nested data into each module and decouple them from each other.

Simply put, it kind of likes treating a portion of your store as if it were a database, and keep that data in a normalized form.

[This is an excellent article](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) that describes the hardness of the nested data structure. It also explains how to design normalized state.

## What Is It Like To Use Vuex ORM

Here we show how it would look like to be using Vuex ORM on your application.

Let's say you fetch posts data from a server and the response is something like below.

```js
const post = [
  {
    id: 1,
    body: "......",
    author: { id: 1, username: "user1", name: "User 1" },
    comments: [
      {
        id : 1,
        author : { id: 2, username: "user2", name : "User 2" },
        comment : "....."
      },
      {
        id: 2,
        author: { id: 2, username: "user2", name: "User 2" },
        comment: "....."
      }
    ]    
  },
  {
    id: 2,
    author: { id: 2, username: "user2", name: "User 2" },
    body: "......",
    comments: [
      {
        id: 3,
        author: { id: 3, username: "user3", name: "User 3" },
        comment: "....."
      },
      {
        id: 4,
        author: { id: 1, username: "user1", name: "User 1" },
        comment: "....."
      },
      {
        id: 5,
        author: { id: 3, username: "user3", name: "User 3" },
        comment: "....."
      }
    ]    
  }
  // and so on...
]
```

See there are lots of `author` fields and some of them are the exact same authors. If you save this data to the store as is, it's going to be very hard to update those authors or comments.

When you store above posts data using Vuex ORM, the look of the Vuex Store State is going to be as below.

```js
// Save data using Vuex Action.
store.dispatch('entities/posts/create', { data: posts })

// Then inside Vuex State becomes like this.
{
  entities: {
    comments: {
      data: {
        "1": {
          id: 1,
          author: "2",
          comment: "....."
        },
        "2": {
          id: 2,
          author: "2",
          comment: "....."
        },
        "3": {
          id: 3,
          author: "3",
          comment: "....."
        },
        "4": {
          id: 4,
          author: "1",
          comment: "....."
        },
        "5": {
          id: 5,
          author: "3",
          comment: "....."
        }
      }
    },

    posts: {
      data: {
        "1": {
          id: 1,
          body: "......",
          author: "1",
          comments: ["1", "2"]  
        },
        "2": {
          id: 2,
          author: ["2"],
          body: "......",
          comments: ["3", "4", "5"]
        }
      }
    },

    users: {
      data: {
        "1": {
          id: 1,
          username: "user1",
          name: "User 1" 
        },
        "2": {
          id: 2,
          username: "user2",
          name: "User 2" 
        },
        "3": {
          id: 3,
          username: "user3",
          name: "User 3"
        }
      }
    }
  }
}
```

See how each data is decoupled and deduplicated. Then you can fetch these data using Vuex Getters. These getters are also built in by Vuex ORM.

```js
// Fetch only posts.
const posts = store.getters['entities/posts/all']()

/*
  [
    { id: 1, body: "......" },
    { id: 2, body: "......" }
  ]
*/

// Fetch posts with relation.
const posts = store.getters['entities/posts/query']().with('author').get()

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

// Fetch data matching specific condition.
const posts = store.getters['entities/posts/query']()
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

Not only fetching saved data, but Vuex ORM also lets you create Model Class for each data structure. So when you retrieve data from the store by getters, those become a class instance.

```js
{
  entities: {
    users: {
      data: {
        "1": {
          id: 1,
          first_name: 'John',
          last_name: 'Doe'
        }
      }
    }
  }
}

// Define Model as class.
import { Model } from '@vuex-orm/core'

class User extends Model {
  fullName () {
    return this.first_name + ' ' + this.last_name
  }
}

// Fetch user from the store.
const user = store.getters['entities/users/find'](1)

// The `user` is an instance of User class!
user.first_name // John
user.last_name  // Doe
user.fullName() // John Doe
```

Now, are you ready to start using Vuex ORM? [Let's get started](getting-started.md).
