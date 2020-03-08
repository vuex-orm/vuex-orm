# Retrieving

Vuex ORM provides a handful of methods to retrieve inserted data. In this section, we'll walk through various ways to query the Vuex Store.

When querying the data from the store, in most of the cases you want to query data inside `computed` property. This way, when any data changes, the part of your application where you use those data gets updated reactively. It works as same as Vuex Getters, and in fact, Vuex ORM is retrieving data from the store via Vuex Getters.

```vue
<template>
  <ul>
    <li :key="user.id" v-for="user in users">
      {{ user.name }}
    </li>
  </ul>
</template>

<script>
import User from '@/models/User'

export default {
  computed: {
    users () {
      return User.all()
    }
  }
}
</script>
```

> **NOTE:** To retrieve records with its relationships, you must explicitly specify which relationships to fetch by `with` query chain. For example, if you want to fetch Users with Posts, you must do `User.query().with('posts').get()`. See [Relationships](#relationships) section for more detail.

## Get All Data

The `all` method is going to fetch all data from the store.

```js
// get all users.
const users = User.all()

/*
  [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
*/
```

## Get Single Data

The `find` method is going to fetch single data from the store. The argument is the id—primary key value—for the record.

```js
// Get a user with id of 1.
const users = User.find(1)

// { id: 1, name: 'John' }
```

If your model has a composite primary key, you can retrieve data by passing an array as the argument. Let's say you have a Subscription model defined like this.

```js
import { Model } from '@vuex-orm/core'

class Subscription extends Model {
  static entity = 'subscription'

  static primaryKey = ['video_id', 'user_id']

  static fields () {
    return {
      video_id: this.attr(null),
      user_id: this.attr(null)
    }
  }
}
```

Then, you can retrieve Subscription records as below. Remember that the value order in the array is the same as the order you defined in your Model's primary key property. In this case it's `['video_id', 'user_id']`.

```js
// Get a subscription with video_id 1 and user_id 2.
const subscription = Subscription.find([1, 2])

// { video_id: 1, user_id: 2 }
```

## Get Multiple Data by Primary Keys

The `findIn` method is going to fetch array of data from the store. The argument is array of ids—primary key value—for the records.

```js
// Retrieve array of records by their primary keys.
const users = User.findIn([1, 2])

/*
  [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
*/
```

Similarly to `find`, if your model has a composite primary key you can pass an array of arrays as the argument.

```js
// Retrieve array of records by their composite primary keys.
const subscriptions = Subscription.findIn([[1, 1], [1, 2]])

/*
  [
    { video_id: 1, user_id: 1 },
    { video_id: 1, user_id: 2 }
  ]
*/
```

## Query Builder

The `query` method will return the Query Builder that provides fluent API to search and fetch data from the store. You can use the query builder to construct more complex query conditions.

You can obtain query builder by calling the `query` method.

```js
// Get Query Builder instanse.
const query = User.query()
```

To execute the query, you can either use a `get` method. The `get` method will execute all query conditions, and get all records that matched to the condition.

```js
// Get all users through Query Builder.
const users = User.query().get()

/*
  [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
*/
```

You may use `first` method to fetch a single data for the entity. It will return the very first item of the query results.

```js
// Get the first user of the query.
const user = User.query().first()

// { id: 1, name: 'John' }
```

As oppose to `first` method, the `last` method returns the last matching data.

```js
const user = User.query().last()

// { id: 2, name: 'Jane' }
```

## Where Clauses

Where clause is the most generic way of filtering the records. The first argument should be the name of the field, and the second should be the value.

```js
// Get users with age of 20.
const user = User.query().where('age', 20).get()
```

You may pass a closure to the 2nd argument when you need more powerful constraints. The argument is the value of the field.

```js
// Get users with age higher than 20.
const user = User.query().where('age', value => value > 20).get()
```

Or, you may pass a closure to the 1st argument to get full control of the condition. The argument is the data itself.

```js
// Get users with age higher than 20 and also a female.
const user = User.query().where((user) => {
  return user.age > 20 && user.sex === 'female'
}).get()
```

> **NOTE:** When returning the result of the condition, you must explicitly return a boolean, `true` or `false`. It will not work if you return a falsy value other than `false`, for example, `undefined` or `null`. See [GitHub Issue #402](https://github.com/vuex-orm/vuex-orm/issues/402) for more details.

When passing a closure to the 1st argument, it will also receive query builder as the 2nd argument. By using the query builder, you may nest the where clause. This is useful when you want "group" the where clauses.

```js
// Retrieve all users with role of user, and age of 20 or id of 1.
const user = User.query()
  .where('role', 'user')
  .where((_record, query) => {
    query.where('age', 20).orWhere('id', 1)
  })
  .get()
```

### Get Data By Id

Use `whereId` method to fetch a single data by using its id. This filters data faster than other `where` methods because it will use direct key lookup. The argument is the id—primary key value—for the record.

```js
const user = User.query().whereId(1).first()
```

You may also use `whereIdIn` method to get multiple records by id look up. The argument is array of ids—primary key values—for the records.

```js
const user = User.query().whereIdIn([1, 2]).get()
```

#### Composite Primary Keys

Both `whereId` and `whereIdIn` support models with [composite primary keys](/guide/model/defining-models.md#primary-key).

```js
const user = User.query().whereId([1, 2]).first()

const users = User.query().whereIdIn([[1, 2], [3, 2]]).get()
```

### Or Statement

You may chain where constraints together as well as add `or` conditions to the query. The `orWhere` method accepts the same arguments as the `where` method.

```js
// Fetch users with role of `admin`, or name of `John`.
const user = User.query()
  .where('role', 'admin')
  .orWhere('name', 'John')
  .get()
```

## Exists

The `exists` method allows you to check whether a query chain would return any records. The method will return either `true` or `false`.

```js
// Check whether the user store contains any data.
const resultExists = User.exists()

// Check whether an user with id 5 exists.
const resultExists = User.query().where('id', 5).exists()
```

## Order By

The `orderBy` method allows you to sort the result of the query by a given field. The first argument to the orderBy method should be the column you wish to sort by, while the second argument controls the direction of the sort, and may be either `asc` or `desc`. If there is no 2nd argument, the direction is going to be `asc`.

```js
// Order users by name.
const users = User.query().orderBy('name').get()

/*
  [
    { id: 2, name: 'Andy' },
    { id: 1, name: 'John' }
  ]
*/


// You may also chain orderBy.
const users = User.query()
  .orderBy('name')
  .orderBy('age', 'desc')
  .get()

/*
  [
    { id: 4, name: 'Andy', age: 32 },
    { id: 2, name: 'Andy', age: 27 },
    { id: 6, name: 'Jane', age: 42 }
  ]
*/
```

You may also pass a function as the 1st argument. The function will accept a record that is being sorted, and it should return value to be sorted by.

```js
// Sort user name by its 3rd character.
const users = User.query().orderBy(user => user.name[2]).get()

/*
  [
    { id: 4, name: 'Andy' },
    { id: 2, name: 'Roger' },
    { id: 1, name: 'John' }
  ]
*/
```

## Limit & Offset

Use `limit` method to set the maximum number of records to retrieve.

```js
const user = User.query().limit(2).get()

// [{ id: 1, age: 25 }, { id: 2, age: 30 }]
```

Use `offset` method to set the offset for the data.

```js
const user = User.query().offset(2).get()

// [{ id: 3, age: 35 }, { id: 4, age: 40 }]
```

Both `offset` and `limit` can be chained together to paginate through data.

```js
const user = User.query().offset(1).limit(2).get()

// [{ id: 2, age: 30 }, { id: 3, age: 35 }]
```

## Aggregates

The query builder also provides aggregate methods. Available methods are `count`, `max`, `min` and `sum`.

```js
const users = User.query().count()

const mostLiked = Post.query().max('like')

const cheapest = Order.query().min('price')

const total = Order.query().sum('price')
```

Of course, you may combine these methods with other clauses.

```js
const users = User.query().where('role', 'user').count()
```

## Relationships

You can use the `with` method to load related model when querying data. The argument to the `with` method should be the name of the field that defines the relationship, _not_ the entity name of the related model.

```js
const user = User.query().with('profile').with('posts').first()

/*
  {
    id: 1,
    name: 'John',

    profile: {
      id: 1,
      user_id: 1,
      age: 24
    },

    posts: [
      { id: 1, user_id: 1, body: '...' },
      { id: 2, user_id: 1, body: '...' }
    ]
  }
*/
```

### Load Nested Relation

You can load nested relations with dot syntax.

```js
const user = User.query().with('posts.comments').first()

/*
  {
    id: 1,
    name: 'john',

    posts: [
      {
        id: 1,
        user_id: 1,
        body: '...',

        comments: [
          { id: 1, post_id: 1, body: '...' },
          { id: 2, post_id: 1, body: '...' }
        ]
      },
      {
        id: 2,
        user_id: 1,
        body: '...',

        comments: [
          { id: 3, post_id: 2, body: '...' },
          { id: 4, post_id: 2, body: '...' }
        ]
      }
    ]
  }
*/
```

You can load multiple sub relations by separating them with `|` (symbolizing the `or` syntax):

```js
// Fetching all comments & reviews from user.posts.
const user = User.query()
  .with('posts.comments|reviews')
  .first()
```

Or passing an array of relations (in that case, the full path is needed):

```js
// Fetching all comments & reviews from user.posts + user.profile.
const user = User.query()
  .with(['posts.comments', 'posts.reviews', 'profile'])
  .first()
```

### Load All Relations

You can load all relations using the `withAll` method.

```js
const user = User.query().withAll().first()

/*
  {
    id: 1,
    name: 'john',

    profile: {
      id: 1,
      user_id: 1,
      age: 24
    },

    posts: [
      {
        id: 1,
        user_id: 1,
        body: '...'
      },

      {
        id: 2,
        user_id: 1,
        body: '...'
      }
    ]
  }
*/
```

To fetch all sub relations of a relation using the dot syntax, use `*`.

```js
 // Fetches all relations of all posts.
const user = User.query().with('posts.*').first()
```

To fetch all sub relations to a certain level you can use the `withAllRecursive` method. You can specify a depth to which relations should be loaded. The depth defaults to 3, so if you call `withAllRecursive` with no arguments, it will fetch all sub relations of sub relations of sub relations of the queried entity.

```js
const user = User.query().withAllRecursive().first()

/*
  User {
    id: 1,
    name: 'john',

    profile: {
      id: 1,
      user_id: 1,
      age: 24
    },

    posts: [
      {
        id: 1,
        user_id: 1,
        body: '...',

        comments: [
          { id: 1, post_id: 1, body: '...' },
          { id: 2, post_id: 1, body: '...' }
        ]
      },
      {
        id: 2,
        user_id: 1,
        body: '...',

        comments: [
          { id: 3, post_id: 2, body: '...' },
          { id: 4, post_id: 2, body: '...' }
        ]
      },
    ]
  }
*/
```

## Relationship Constraints

To filter the result of relation loaded by the `with` method, you can pass a closure to the second argument to define additional constraints to the query.

```js
// Get all users with posts that have `published` field value of `true`.
const user = User.query().with('posts', (query) => {
  query.where('published', true)
}).get()

/*
  [
    {
      id: 1,
      name: 'John',
      posts: [
        { id: 1, user_id: 1, body: '...', published: true },
        { id: 2, user_id: 1, body: '...', published: true }
      ]
    }
  ]
*/
```

When you add constraints to the "nested" relation, the constraints will be applied to the deepest relationship.

```js
const user = User.query().with('posts.comments', (query) => {
  // This constraint will be applied to the `comments`, not `posts`.
  query.where('type', 'review')
}).get()
```

If you need to add constraints to each relation, you could always nest constraints. This is the most flexible way of defining constraints to the relationships.

```js
const user = User.query().with('posts', (query) => {
  query.with('comments', (query) => {
    query.where('type', 'review')
  }).where('published', true)
}).get()
```

## Relationship Existence & Absence

When querying the record, you may wish to limit your results based on the existence of a relationship. For example, imagine you want to retrieve all blog posts that have at least one comment. To do so, you may pass the name of the relationship to the `has` methods.

```js
// Retrieve all posts that have at least one comment.
Post.query().has('comments').get()
```

You may also specify count as well.

```js
// Retrieve all posts that have at least 2 comments.
Post.query().has('comments', 2).get()
```

Also, you may add an operator to customize your query even more. The supported operators are `=`, `>`, `>=`, `<` and `<=`.

```js
// Retrieve all posts that have more than 2 comments.
Post.query().has('comments', '>', 2).get()

// Retrieve all posts that have less than or exactly 2 comments.
Post.query().has('comments', '<=', 2).get()
```

If you need even more power, you may use the `whereHas` method to put "where" conditions on your `has` queries. This method allows you to add customized constraints to a relationship constraint, such as checking the content of a comment.

```js
// Retrieve all posts that have comment from user_id 1.
Post.query().whereHas('comments', (query) => {
  query.where('user_id', 1)
}).get()
```

To retrieve records depending on the absence of the relationship, use the `hasNot` and `whereHasNot` methods. These methods will work the same as `has` and `whereHas` but with the opposite result.

```js
// Retrieve all posts that doesn't have comments.
Post.query().hasNot('comments').get()

// Retrieve all posts that doesn't have comment with user_id of 1.
Post.query().whereHasNot('comments', (query) => {
  query.where('user_id', 1)
}).get()
```
