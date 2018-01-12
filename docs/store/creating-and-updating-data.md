# Store: Creating And Updating Data

To create new data within Vuex Store, you can use `create` or `insert` action. You can call them from root entities module, or from registered submodules.

```js
// Call create method from submodule.
store.dispatch('entities/users/create', { data: { ... } })

// Call same method from root module. You have to pass an entity name.
store.dispatch('entities/create', { entity: 'users', data: { ... } })
``` 

## Creating

You can use `create` and `insert` method to add data to Vuex ORM.

The `create` method is going to replace all existing data in store and create fresh new data.

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

`data` is a plain data you wish to create in store. It could be either `Object` (single data) or `Array` (list of data).

### Insert

The `insert` method is going to insert data to the store while keeping existing data. If the inserting data has the same primary key as existing data, that data is going to be replaced by the new one.

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

Same as `create`, `data` could be either `Object` (single data) or `Array` (list of data).

## Updating

The `update` action updates data in the Store. `update` action takes `where` condition and `data` as payload.

`where` condition can be `Number` or `string` representing the value of the primary key or can be `Function` to determine the target data. `Function` takes the record as the argument and must return `Boolean`.

`data` is the data you want to update.

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

Alternatively, you may pass data object as a payload. In this case, primary key must exist in the data.

```js
store.dispatch('entities/users/update', {
  id: 2, // Primary key must exist.
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

When specifying `where` condition by a closure, it is possible to update multiple records at once.

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

### Dispatching Update From Root Module

You can also dispatch action from root module. Remember to pass `entity` name in this case.

```js
store.dispatch('entities/update', {
  entity: 'users',
  where: 2,
  data: { age: 24 }
})
```

Note that since root module needs `entity`, you can't dispatch root module action by passing condition directly.

```js
// This would not work.
store.dispatch('entities/update', { id: 2, age: 24 })
```
