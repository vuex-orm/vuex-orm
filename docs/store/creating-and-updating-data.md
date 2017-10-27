# Store: Creating And Updating Data

To create new data within Vuex Store, you can use `create` or `insert` action. You can call them from root entities module, or from registered submodules.

```js
// Call create method from submodule.
store.dispatch('entities/users/create', { data: { ... } })

// Call same method from root module. You have to pass an entity name.
store.dispatch('entities/create', { entity: 'users', data: { ... } })
``` 

## Create

The `create` method is going to replace all existing data in store and create fresh new data.

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        "2": { id: 2, name: 'Jane' }
      }
    }
  }
}

// `create` is going to replace all with new one.
store.dispatch('entities/users/create', {
  data: { id: 1, name: 'John' }
})

// State after `create`.
{
  entities: {
    users: {
      data: {
        "1": { id: 1, name: 'John' }
      }
    }
  }
}
```

`data` is a plain data you wish to create in store. It could be either `Object` (single data) or `Array` (list of data).

## Insert

The `insert` method is going to insert data to the store while keeping existing data. If the inserting data has the same primary key as existing data, that data is going to be replaced by the new one.

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        "2": { id: 2, name: 'Jane' }
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
        "1": { id: 1, name: 'John' },
        "2": { id: 2, name: 'Jane' }
      }
    }
  }
}
```

Same as `create`, `data` could be either `Object` (single data) or `Array` (list of data).
