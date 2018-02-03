# Store: Inserting And Updating Data

To insert or update data, you can dispatch corresponding actions through modules. Let's see what kind of actions are available.

## Inserts

To create a new data in the store, you can use `create` and `insert` action. You should pass an object with data key to the payload.

```js
store.dispatch('entities/users/create', {
  data: { id: 1, name: 'John' }
})

// Or

store.dispatch('entities/users/insert', {
  data: { id: 1, name: 'John' }
})
```

The difference between `create` and `insert` action is whether to keep existing data or not.

The `create` method is going to replace all existing data in store and replace with given data.

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        '2': { id: 2, name: 'Jane' }
      }
    }
  }
}

// `create` is going to replace all existing data with the new one.
store.dispatch('entities/users/create', {
  data: { id: 1, name: 'John' }
})

// State after `create`.
{
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'John' }
      }
    }
  }
}
```

The `insert` method is going to insert data into the store while keeping existing data. If the inserting data has the same primary key as existing data, that data is going to be replaced by the new one.

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        '2': { id: 2, name: 'Jane' }
      }
    }
  }
}

// `insert` is going to leave existing data as is.
store.dispatch('entities/users/insert', {
  data: {
    id: 1,
    name: 'John'
  }
})

// State after `insert`.
{
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' }
      }
    }
  }
}
```

### Insert Many Data

You can pass an array of objects to insert multiple data. It works for both `create` and `insert`.

```js
store.dispatch('entities/users/insert', {
  data: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ]
})
```

## Default Values

If you pass an object that has missing fields defined in the model, that field will be automatically generated with the default value defined in the model.

```js
// When you have this model.
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      active: this.attr(false)
    }
  }
}

// If you insert object that misses some fields...
store.dispatch('entities/users/create', {
  data: { id: 1, name: 'John Doe '}
})

// Missing field will be present with its default value.
{
  entities: {
    users: {
      data: {
        '1': {
          id: 1,
          name: 'John Doe',
          active: false
        }
      }
    }
  }
}
```

### Inserting Relationships

If you pass data with relationships inside to the `create` or `insert` action, those relationships will be normalized and inserted to the store. Please see [Inserting Relationships](relationships/inserting-relationships.md) for more detail.

## Updates

To update existing data, you can do so with `update` action. `update` action takes `where` condition and `data` as payload.

```js
store.dispatch('entities/users/update', {
  where: 2,
  data: { age: 24 }
})
```

`where` condition can be a `Number` or a `String` representing the value of the primary key of the model or can be a `Function` to determine the target data. `Function` takes the record as the argument and must return `Boolean`.

`data` is the data you want to update.

Let's see some example here to understand how it works.

```js
// Initial State.
{
  entities: {
    users: {
      '1': { id: 1, name: 'John', age: 20 },
      '2': { id: 2, name: 'Jane', age: 30 }
    }
  }
}

// Update data.
store.dispatch('entities/users/update', {
  where: 2,
  data: { age: 24 }
})

// State after `update`
{
  entities: {
    users: {
      '1': { id: 1, name: 'John', age: 20 },
      '2': { id: 2, name: 'Jane', age: 24 }
    }
  }
}
```

You can pass a function to the `where` to get more control. Remember to return boolean in this case.

```js
store.dispatch('entities/users/update', {
  where: (record) => {
    return record.id === 2
  },

  data: { age: 24 }
})
```

Alternatively, you may pass whole data object as a payload. In this case, the primary key must exist in the data object.

```js
store.dispatch('entities/users/update', {
  id: 2, // <- Primary key must exist.
  age: 24
})

// Above code is equivalent to this.
store.dispatch('entities/users/update', {
  where: 2,
  data: { age: 24 }
})

// And this is same too.
store.dispatch('entities/users/update', {
  where (record) {
    return record.id === 2
  },

  data: { age: 24 }
})
```

### Updating Multiple Data

When specifying `where` condition by a function, it's possible to update multiple records at once.

```js
// Initial State.
{
  entities: {
    users: {
      '1': { id: 1, role: 'user', active: true },
      '2': { id: 2, role: 'user', active: true },
      '3': { id: 3, role: 'admin', active: true }
    }
  }
}

// Update data.
store.dispatch('entities/users/update', {
  where (record) {
    return record.role === 'user'
  },

  data: { active: false }
})

// State after `update`
{
  entities: {
    users: {
      '1': { id: 1, role: 'user', active: false },
      '2': { id: 2, role: 'user', active: false },
      '3': { id: 3, role: 'admin', active: true }
    }
  }
}
```

## Dispatching Actions from Root Module

You can dispatch action from root module as well. With this syntax, you must specify the entity manually by passing `entity` field.

```js
store.dispatch('entities/create', { entity: 'users', data: { ... } })

// Above is equivalent to this.
store.dispatch('entities/users/create', { data: { ... } })
``` 

Note that since root module needs `entity`, you can't dispatch `update` action through root by passing condition directly.

```js
// This would not work.
store.dispatch('entities/update', { id: 2, age: 24 })

// you must have entity field.
store.dispatch('entities/update', {
  entity: 'users',
  where: 2,
  data: { age: 24 }
})
```
