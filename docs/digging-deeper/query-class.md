# Query Class

Query class is responsible for fetching data from Vuex Store. When you fetch data through Vuex getters such as `store.getters['entities/users/find'](1)`, it's using the Query class to find and filter data.

Usually, you wouldn't need to care about Query class as long as you keep using getters. However, when want to add global features when querying data, it might be useful to use lifecycle hook. This is especially useful when you want to create a plugin for the Vuex ORM.

## Lifecycle Hooks

Query class comes with following lifecycle hooks.

- `beforeProcess` – Called before data get filtered.
- `afterWhere` – Called right after the data get filtered by `where` clause.
- `afterOrderBy` – Called right after the data get sorted by `orderBy` clause.
- `afterLimit` – Called right after the data get limited by `limit` and `offset` clause.

By registering callbacks to each hook, you can manipulate the result from the getter call.

### Register Callbacks

You can register the callbacks by static `on` method. The callback will receive 2 arguments. The 1st argument is the array of the records that will be processed by the current query. The 2nd argument is the name of the entity which is being processed. The callback must return an array containing new records.

```js
import Query from 'vuex-orm/core'

// Add extra `hooked` field on each record.
Query.on('beforeProcess', (records, entity) => {
  return records.map((record) => {
    record.hooked = true

    return record
  })
})

store.getters['entities/users/all']()

[
  { id: 1, name: 'John Doe', hooked: true },
  { id: 2, name: 'Jane Doe', hooked: true }
]
```
