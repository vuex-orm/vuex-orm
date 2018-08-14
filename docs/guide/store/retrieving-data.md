# Retrieving Data

You can use getters to retrieve data from the Vuex Store. Not only it fetches the data, but Vuex ORM will convert those fetched data into a model class instance.

```js
const user = store.getters['entities/users/find'](1)

// User { id: 1, name: 'name' }
```

> **NOTE:** To fetch data with its relationship, you must call `with` method during the query. Please see [Retrieving Relationships](../relationships/retrieving-relationships.md) for more detail.

## Get All Data

`all` getter is going to fetch all data from the store.

```js
const users = store.getters['entities/users/all']()

/*
  [
    User { id: 1, name: 'John' },
    User: { id: 2, name: 'Jane' }
  ]
*/
```

## Get Single Data

`find` getter is going to fetch single data from the store. The argument is the id – primary key value – for the record.

```js
// Retrieve a record by its primary key.
const users = store.getters['entities/users/find'](1)

// User { id: 1, name: 'John' }
```

## Query Builder

The `query` getter will return the query builder that provides fluent API to search and fetch data from the store. You can use the query builder to construct the more complex query conditions.

You can obtain query builder by calling `query` getter.

```js
const query = store.getters['entities/users/query']()
```

Or you may omit `query` and directly call module. This is just a shorthand for the `query` getter.

```js
const query = store.getters['entities/users']()
```

### Get All Data

Use `get` method to fetch all data for the entity. The result is going to be an array containing a list of model instances.

```js
const users = store.getters['entities/users/query']().get()

// [User { id: 1, name: 'John' }, User: { id: 2, name: 'Jane' }]
```

### Get A Single Data

Use `first` method to fetch a single data for the entity. It will return the very first item in the state.

```js
const user = store.getters['entities/users/query']().first()

// User { id: 1, name: 'John' }
```

### Get The Last Matching Data

As oppose to `first` method, the `last` method returns the last matching data.

```js
const user = store.getters['entities/users/query']().last()
```

### Where Clauses

#### Simple Where Clauses

You may use the `where` method on a query chain to add where conditions. For example, here is a query that fetches all users that have "age" value of "20".

```js
const user = store.getters['entities/users/query']().where('age', 20).get()

// [User { id: 1, age: 20 }, User { id: 2, age: 20 }]
```

You may pass a closure to the 2nd argument when you need more powerful constraint. The argument is the value of the field.

```js
const user = store.getters['entities/users/query']().where('age', value => value > 20).get()

// [User { id: 1, age: 25 }, User { id: 2, age: 30 }]
```

Or, you may pass a closure to the 1st argument to get full control of the condition. The argument is the data itself.

```js
const user = store.getters['entities/users/query']().where(record => record.age > 20).get()

// [User { id: 1, age: 25 }, User { id: 2, age: 30 }]
```

When passing a closure to the 1st argument, it will also receive query builder as the 2nd argument. By using the query builder, you may nest the where clause. This is useful when you want "group" the where clauses.

```js
// Retrieve all users with role of user, and age of 20 or id of 1.
const user = store.getters['entities/users/query']()
  .where('role', 'user')
  .where((_record, query) => {
    query.where('age', 20).orWhere('id', 1)
  })
  .get()
```

Finally, the model instance is passed as a 3rd argument. It's useful when you want to use a model method or [mutated](../advanced/accessors-and-mutators.md) property for the condition.

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

The `orderBy` method allows you to sort the result of the query by a given field. The first argument to the orderBy method should be the column you wish to sort by, while the second argument controls the direction of the sort and may be either `asc` or `desc`. If there is no 2nd argument, the direction is going to be `asc`.

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

The query builder also provides aggregate methods. Available methods are `count`, `max`, `min` and `sum`.

```js
const users = store.getters['entities/users/query']().count()

const mostLiked = store.getters['entities/posts/query']().max('like')

const cheapest = store.getters['entities/orders/query']().min('price')

const total = store.getters['entities/orders/query']().sum('price')
```

Of course, you may combine these methos with other clauses.

```js
const users = store.getters['entities/users/query']()
  .where('role', 'user')
  .count()
```

