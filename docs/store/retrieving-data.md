# Store: Retrieving Data

## Basic Usage

You can use Vuex Getters to retrieve data from the store. Notice that the retrieved data is the model instance.

```js
const user = store.getters['entities/users/find'](1)

// User { id: 1, name: 'name' }
```

## Query Builder

The `query` getter provides fluent API to search and fetch data from the store.

### Get All Data

Use `get` method to fetch all data for the entity. The result will be an array containing list of model instances.

```js
const users = store.getters['entities/users/query']().get()

// [User { id: 1, name: 'John' }, User: { id: 2, name: 'Jane' }]
```

### Get A Single Data

Use `first` method to fetch a single data for the entity.

```js
const user = store.getters['entities/users/query']().first()

// User { id: 1, name: 'John' }
```

### Where Clauses

#### Simple Where Clauses

You may use the `where` method on a query chain to add where conditions. For example, here is a query that verifies the value of the "age" column is equal to 20.

```js
const user = store.getters['entities/users/query']().where('age', 20).get()

// [User { id: 1, age: 20 }, User { id: 2, age: 20 }]
```

You may pass closure to the second argument if you need more powerful checking. The argument is the value of the field.

```js
const user = store.getters['entities/users/query']().where('age', value => value > 20).get()

// [User { id: 1, age: 25 }, User { id: 2, age: 30 }]
```

Or you may pass closure to the first argument to get full control of the condition. The argument is the data it self.

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
