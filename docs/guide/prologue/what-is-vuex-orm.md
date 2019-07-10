# What is Vuex ORM?

Vuex ORM is a plugin for Vuex to enable Object-Relational Mapping access to the Vuex Store. But why do we need ORM at the front-end?

Many applications deal with data that is nested or relational in nature. For example, a blog editor could have many Posts, each Post could have many Comments, and both Posts and Comments would be written by a User. Using data in such kind of "nested or relational" structure can be very difficult for JavaScript applications, especially those using the single tree state management system such as [Vuex](https://vuex.vuejs.org) or [Redux](http://redux.js.org).

To nicely handle such data, one approach is to split the nested data into separate modules and decouple them from each other. Simply put, it's kind of like treating a portion of your store as if it were a database, and keep that data in a normalized form.

[This is an excellent article](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) that describes the difficulty of nested data structures. It also explains how to design normalized state, and Vuex ORM is heavily inspired by it.

Note that in this documentation, we're borrowing many examples and texts from the article. I would like to credit [Redux](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) and the author of the section [Mark Erikson](https://github.com/markerikson) for the beautiful piece of article.

## Issue with Nested Relational Data

Let's say you fetch posts data from a backend server. In many cases, the response might look something like:

```js
[
  {
    id: 1,
    body: '.....',
    author: { id: 1, name: 'User 1' },
    comments: [
      {
        id: 1,
        comment: '.....',
        author: { id: 2, name: 'User 2' }
      },
      {
        id: 2,
        comment: '.....',
        author: { id: 2, name: 'User 2' }
      }
    ]
  },
  {
    id: 2,
    author: { id: 2, name: 'User 2' },
    body: '.....',
    comments: [
      {
        id: 3,
        comment: '.....',
        author: { id: 3, name: 'User 3' }
      },
      {
        id: 4,
        comment: '.....',
        author: { id: 1, name: 'User 1' }
      },
      {
        id: 5,
        comment: '.....',
        author: { id: 3, name: 'User 3' }
      }
    ]
  }
  // And so on...
]
```

Notice that the structure of the data is a bit complex, and some of the data is repeated. It contains lots of `author` fields, which is a User. Some of them are the exact same User. If you save this data to the store as is, there will be a concern for several reasons:

- When a piece of data is duplicated in several places, it becomes harder to make sure that it is updated appropriately.
- Nested data means that the corresponding logic to process this data has to be more nested and therefore more complex. In particular, trying to update a deeply nested field can become very ugly very fast.

Because of this, the recommended approach to managing nested or relational data in a store is to treat a portion of your store as if it were a database, and keep that data in a *normalized* form.

## Normalizing Data

The basic concepts of normalizing data are:

- Each type of data gets its own "table" in the state.
- Each "data table" should store the individual items in an object, with the IDs of the items as keys and the items themselves as the values.
- Any references to individual items should be done by the foreign keys.

As you may notice, it's pretty much the same as how ordinally relational database system manages the relations. We could do the same for our store.

An example of a normalized state structure for the blog posts example above might look like:

```js
{
  posts: {
    1: { id: 1, user_id: 1, body: '.....' },
    2: { id: 2, user_id: 2, body: '.....' }
  },

  comments: {
    1: { id: 1, user_id: 2, post_id: 1, comment: '.....' },
    2: { id: 2, user_id: 2, post_id: 1, comment: '.....' },
    3: { id: 3, user_id: 3, post_id: 2, comment: '.....' },
    4: { id: 4, user_id: 1, post_id: 2, comment: '.....' },
    5: { id: 5, user_id: 3, post_id: 2, comment: '.....' }
  },

  users: {
    1: { id: 1, name: 'User 1' },
    2: { id: 2, name: 'User 2' },
    3: { id: 3, name: 'User 3' }
  }
}
```

This state structure is much flatter overall. Compared to the original nested format, this is an improvement in several ways:

- Because each item is only defined in one place, we don't have to try to make changes in multiple places if that item is updated.
- The logic that interacts with the data doesn't have to deal with deep levels of nesting, so it will probably be much simpler.
- The logic for retrieving or updating a given item is now fairly simple and consistent. Given an item's type and its id, we can directly look it up in a couple of simple steps, without having to dig through other objects to find it.

Note that a normalized state structure generally implies that more components are connected and each component is responsible for looking up its own data, as opposed to a few connected components looking up large amounts of data and passing all that data downwards. As it turns out, having connected parent components simply pass item ids to connected children is a good pattern for optimizing UI performance as well, so keeping state normalized plays a key role in improving performance.

However, it's still hard to actually organize such normalized data. You must write some kind of logic to "normalize" the input data, and also you must write logic to retrieve the data with also resolving any necessary relationships in mind. Here is where Vuex ORM comes in.

## How Vuex ORM Handles Data

Vuex ORM will manage both creating (normalizing) and also retrieving data through fluent and sufficient API.

Let's say we want to store above blog posts data. You'll first create a representing "Model" for Post, Comment, and User.

The Model would look like:

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      body: this.string(''),
      comments: this.hasMany(Comment, 'post_id')
    }
  }
}

class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      post_id: this.attr(null),
      comment: this.string(''),
      author: this.belongsTo(User, 'user_id')
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string('')
    }
  }
}
```

Then you may simply call Model's `insert` method to insert data.

```js
Post.insert({ data: posts })
````

With this simple method, Vuex ORM will automatically normalize the given data and save them inside Vuex Store State as following structure.

```js
{
  entities: {
    posts: {
      data: {
        1: { id: 1, user_id: 1, body: '.....' },
        2: { id: 2, user_id: 2, body: '.....' }
      }
    },

    comments: {
      data: {        
        1: { id: 1, user_id: 2, post_id: 1, comment: '.....' },
        2: { id: 2, user_id: 2, post_id: 1, comment: '.....' },
        3: { id: 3, user_id: 3, post_id: 2, comment: '.....' },
        4: { id: 4, user_id: 1, post_id: 2, comment: '.....' },
        5: { id: 5, user_id: 3, post_id: 2, comment: '.....' }
      }
    },

    users: {
      data: {
        1: { id: 1, name: 'User 1' },
        2: { id: 2, name: 'User 2' },
        3: { id: 3, name: 'User 3' }
      }
    }
  }
}
```

Notice that Vuex ORM will even generate any missing foreign keys (in this case `user_id`) during the normalization process.

Now, you can fetch these data using Model's fluent query builder just like ordinally ORM library.

```js
// Fetch all posts.
const posts = Post.all()

/*
  [
    { id: 1, body: '.....' },
    { id: 2, body: '.....' }
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
      body: '.....',
      author: {
        id: 1,
        name: 'User 1'
      }
    },
    {
      id: 2,
      body: '.....',
      author: {
        id: 2,
        name: 'User 2'
      }
    }
  ]
*/
```

```js
// Fetch data matching specific condition.
const posts = Post.query().with('author').where('id', 1).get()

/*
  [
    {
      id: 1,
      body: '.....',
      author: {
        id: 1,
        username: 'user1',
        name: 'User 1'
      }
    }
  ]
*/
```

Cool, isn't it? Are you ready to start using Vuex ORM? [Let's get started](getting-started.md).
