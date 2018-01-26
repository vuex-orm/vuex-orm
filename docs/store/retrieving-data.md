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

Use `get` or `all` method to fetch all data for the entity. The result is going to be an array containing a list of model instances.

```js
const users = store.getters['entities/users/query']().get()

// or

const users = store.getters['entities/users/query']().all()

// [User { id: 1, name: 'John' }, User: { id: 2, name: 'Jane' }]
```

You can also create query builder by directly calling module as a getter.

```js
const users = store.getters['entities/users']().get()

// Above is equivalant to this.
const users = store.getters['entities/users/query']().get()
```

### Get A Single Data

Use `first` or `find` method to fetch a single data for the entity.

```js
const user = store.getters['entities/users/query']().first()

// or

const user = store.getters['entities/users/query']().find()

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

When passing closure to the first argument, it will also receive query builder as second argument. By using the query builder, you may nest the where clause. This is useful when you want "group" the where clauses.

```js
// Retrieve all users with role of user, and age of 20 or id of 1.
const user = store.getters['entities/users/query']()
  .where('role', 'user')
  .where((_record, query) => {
    query.where('age', 20).orWhere('id', 1)
  })
  .get()
```

Finally, the model instance is passed as a 3rd argument. It's useful when you want to use a model method or [mutated](../model/mutators.md) property for the condition.

```js
class User extends Model {
  static entity = 'entity'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      role: this.attr('')
    }
  }

  isAdmin () {
    return this.role === 'admin'
  }
}

const user = store.getters['entities/users/query']()
  .where((_record, _query, model) => {
    return model.isAdmin()
  })
  .get()
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

### Order By

The `orderBy` method allows you to sort the result of the query by a given field. The first argument to the orderBy method should be the column you wish to sort by, while the second argument controls the direction of the sort and may be either `asc` or `desc`. If there is no 2nd argument, direction is going to be `asc`.

```js
// Order users by name.
const user = store.getters['entities/users/query']().orderBy('name').get()

// [User { id: 2, name: 'Andy' }, { id: 1, name: 'John' }]

// You may also chain orderBy.
const user = store.getters['entities/users/query']()
    .orderBy('name')
    .orderBy('age', 'desc')
    .get()

// [User { id: 4, name: 'Andy', age: 32 }, { id: 2, name: 'Andy', age: 27 }]
```

### Offset & Limit

Use `offset` method to set the offset for the data.

```js
const user = store.getters['entities/users/query']().offset(2).get()

// [User { id: 3, age: 35 }, User { id: 4, age: 40 }]
```

Use `limit` method to set the maximum number of records to retrieve.

```js
const user = store.getters['entities/users/query']().limit(2).get()

// [User { id: 1, age: 25 }, User { id: 2, age: 30 }]
```

Both `offset` and `limit` can be chained together to paginate through data.

```js
const user = store.getters['entities/users/query']()
  .offset(1)
  .limit(2)
  .get()

// [User { id: 2, age: 30 }, User { id: 3, age: 35 }]
```

### Aggregates

The query builder also provides aggregate methods. Available methods are `count`, `max` and `min`.

```js
const users = store.getters['entities/users/query']().count()

const mostLiked = store.getters['entities/posts/query']().max('like')

const cheapest = store.getters['entities/orders/query']().min('price')
```

Of course, you may combine these methos with other clauses.

```js
const users = store.getters['entities/users/query']()
  .where('role', 'user')
  .count()
```

### Load Relationship

You can use `with` method to load related model when querying data.

```js
const user = store.getters['entities/users/query']()
  .with('profile')
  .with('posts')
  .find(1)

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
  .find(1)

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
}).find(1)

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
}).find(1)

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

#### Querying Relationship Existence

When querying the record, you may wish to limit your results based on the existence of a relationship. For example, imagine you want to retrieve all blog posts that have at least one comment. To do so, you may pass the name of the relationship to the has methods.

```js
// Retrieve all posts that have at least one comment.
store.getters['entities/posts/query']().has('comments').get()
```

You may also specify count as well.

```js
// Retrieve all posts that have at least 2 comments.
store.getters['entities/posts/query']().has('comments', 2).get()
```

Also you may add operator to customize your query even more. The supported operators are `>`, `>=`, `<` and `<=`.

```js
// Retrieve all posts that have more than 2 comments.
store.getters['entities/posts/query']().has('comments', '>' 2).get()

// Retrieve all posts that have less than or exactly 3 comments.
store.getters['entities/posts/query']().has('comments', '<=' 2).get()
```

And even more, you can pass closure for complex query. If closure may return boolean, or it can just add constraints to the query.

```js
// Retrieve all posts that have user_id of 1.
store.getters['entities/posts/query']().has('comments', (query) => {
  query.where('user_id', 1)
}).get()

// Retrieve all posts that have more than 2 comments with user_id of 1.
store.getters['entities/posts/query']().has('comments', (query) => {
  return query.where('user_id', 1).count() > 2
}).get()
```

#### Querying Relationship Absence

To retrieve records depending on absence of the relationship, use `hasNot` method. `hasNot` method will work same as `has` but in opposite result.

```js
// Retrieve all posts that doesn't have comments.
store.getters['entities/posts/query']().hasNot('comments').get()

// Retrieve all posts that doesn't have comment with user_id of 1.
store.getters['entities/posts/query']().hasNot('comments', (query) => {
  query.where('user_id', 1)
}).get()
```
