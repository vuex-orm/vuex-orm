# Deleting Data

You can delete data by `delete` action. The action must take `where` condition which can be `String`, `Number` or `Function`. 

If you specify `String` or `Number` to the `where` condition, a record that matches the condition with its primary key is going to be deleted.

If you specify `Function` to the `where` condition, that function is going to be used to determine which record to delete. The function takes the record as the argument and must return boolean.

## Delete Data By Primary Key Value

```js
// Initial state.
{
  entities: {
    users: {
      '1': { id: 1, name: 'John' },
      '2': { id: 1, name: 'Jane' }
    }
  }
}

// Delete single data by primary key value.
store.dispatch('entities/users/delete', 1)

// Or you can pass obejct as argument as well.
store.dispatch('entities/users/delete', { where: 1 })

// State after `delete`
{
  entities: {
    users: {
      '2': { id: 1, name: 'Jane' }
    }
  }
}
```

## Delete Data By Closure

```js
// Initial state.
{
  entities: {
    users: {
      '1': { id: 1, name: 'John' },
      '2': { id: 1, name: 'Jane' },
      '3': { id: 1, name: 'George' }
    },
    posts: {
      '1': { id: 1, user_id: 1 },
      '2': { id: 2, user_id: 2 },
      '3': { id: 3, user_id: 3 }
    },
  }
}

// Delete data by closure.
store.dispatch('entities/users/delete', (record) => {
  return record.id === 1 || record.name === 'Jane'
})

// Or with object style.
store.dispatch('entities/users/delete', {
  where (record) {
    return record.id === 1 || record.name === 'Jane'
  }
})

// State after `delete`.
{
  entities: {
    users: {
      '3': { id: 1, name: 'George' }
    },
    posts: {
      '1': { id: 1, user_id: 1 },
      '2': { id: 2, user_id: 2 },
      '3': { id: 3, user_id: 3 }
    },
  }
}
```

## Delete All Data

You can delete all data in once by `deleteAll` action.

```js
// Delete all data for an entity
store.dispatch('entities/users/deleteAll')

// State after `deleteAll`.
{
  entities: {
    users: {},
    posts: {
      '1': { id: 1, user_id: 1 },
      '2': { id: 2, user_id: 2 },
      '3': { id: 3, user_id: 3 },
    }
  }
}

// Delete all data for all entities
store.dispatch('entities/deleteAll')

// State after `deleteAll`.
{
  entities: {
    users: {},
    posts: {}
  }
}
```

## Dispatch Action From Root Module

You can also dispatch action from root module. Remember to pass `entity` name in this case.

```js
store.dispatch('entities/delete', {
  entity: 'users',
  where: 1
})
```

Note that since root module needs `entity`, you can't dispatch root module action by passing condition directly.

```js
// This would not work.
store.dispatch('entities/delete', 1)
```
