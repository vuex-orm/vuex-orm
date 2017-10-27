# Store: Retrieving Data

## Basic Usage

You can use Vuex Getters to retrieve data from the Vuex Store. Notice that the retrieved data is the model instance.

```js
const user = store.getters['entities/users/find'](1)

// User { id: 1, name: 'name' }
```

## Get All Data

`all` getter is going to fetch all data from the Vuex Store.

```js
const users = store.getters['entities/users/all']()

// [User { id: 1, name: 'John' }, User: { id: 2, name: 'Jane' }]
```

## Get Single Data

`find` getter is going to fetch single data from the Vuex Store.

```js
// Retrieve a record by its primary key.
const users = store.getters['entities/users/find'](1)

// User { id: 1, name: 'John' }
```

## Query Builder

The `query` getter provides fluent API to search and fetch data from the store.

### Get All Data

Use `get` method to fetch all data for the entity. The result is going to be an array containing a list of model instances.

```js
const users = store.getters['entities/users/query']().get()

// [User { id: 1, name: 'John' }, User: { id: 2, name: 'Jane' }]
```

### Get A Single Data

Use `first` method to fetch a single data for the entity.

```js
const user = store.getters['entities/users/query']().first(1)

// User { id: 1, name: 'John' }
```

### Where Clauses

#### Simple Where Clauses

You may use the `where` method on a query chain to add where conditions. For example, here is a query that verifies the value of the "age" column is equal to 20.

```js
const user = store.getters['entities/users/query']().where('age', 20).get()

// [User { id: 1, age: 20 }, User { id: 2, age: 20 }]
```

You may pass a closure to the second argument when you need more powerful constraint. The argument is the value of the field.

```js
const user = store.getters['entities/users/query']().where('age', value => value > 20).get()

// [User { id: 1, age: 25 }, User { id: 2, age: 30 }]
```

Alternatively, you may pass a closure to the first argument to get full control of the condition. The argument is the data itself.

```js
const user = store.getters['entities/users/query']().where(record => record.age > 20).get()

// [User { id: 1, age: 25 }, User { id: 2, age: 30 }]
```

#### Or Statement

You may chain where constraints together as well as add `or` condition to the query. The `orWhere` method accepts the same arguments as the where method.

```js
const user = store.getters['entities/users/query']()
  .where('role', 'admin')
  .orWhere('name', 'John')
  .get()

// [User { id: 1, name: 'John', role: 'user' }, User { id: 2, name: 'Jane', role: 'admin' }]
```

### Load Relationship

You can use `with` method to load related model when querying data.

```js
const user = store.getters['entities/users/query']()
  .with('profile')
  .with('posts')
  .first(1)

/*
  User {
    id: 1,
    name: 'john',
    
    profile: Profile {
      id: 1,
      user_id: 1,
      age: 24
    },

    posts: [
      Post: { id: 1, user_id: 1, body: '...' },
      Post: { id: 2, user_id: 1, body: '...' }
    ]
  }
*/
```

#### Load Nested Relation

You can load nested relation with dot syntax.

```js
const user = store.getters['entities/users/query']()
  .with('posts.comments')
  .first(1)

/*
  User {
    id: 1,
    name: 'john',

    posts: [
      Post: {
        id: 1,
        user_id: 1,
        body: '...',

        comments: [
          Comment: { id: 1, post_id: 1, body: '...' },
          Comment: { id: 2, post_id: 1, body: '...' }
        ]
      },

      Post: {
        id: 2,
        user_id: 1,
        body: '...',

        comments: [
          Comment: { id: 3, post_id: 2, body: '...' },
          Comment: { id: 4, post_id: 2, body: '...' }
        ]
      },
    ]
  }
*/
```

#### Relation Constraint

To filter the result of relation loaded with `with` method, you can do so by passing a closure to the second argument.

```js
const user = store.getters['entities/users/query']().with('posts', (query) => {
  query.where('published', true)
}).first(1)

/*
  User {
    id: 1,
    name: 'john',

    posts: [
      Post: { id: 1, user_id: 1, body: '...', published: true },
      Post: { id: 2, user_id: 1, body: '...', published: true }
    ]
  }
*/
```

When you want to add a constraint to the nested relation, use a closure instead of dot syntax.

```js
const user = store.getters['entities/users/query']().with('posts', (query) => {
  query.with('comments', (query) => {
    query.where('type', 'review')
  }).where('published', true)
}).first(1)

/*
  User {
    id: 1,
    name: 'john',

    posts: [
      Post: {
        id: 1,
        user_id: 1,
        body: '...',
        published: true,

        comments: [
          Comment: { id: 1, post_id: 1, body: '...', type: 'review' },
          Comment: { id: 2, post_id: 1, body: '...', type: 'review' }
        ]
      },

      Post: {
        id: 2,
        user_id: 1,
        body: '...',
        published: true,

        comments: [
          Comment: { id: 3, post_id: 2, body: '...', type: 'review' },
          Comment: { id: 4, post_id: 2, body: '...', type: 'review' }
        ]
      },
    ]
  }
*/
```
