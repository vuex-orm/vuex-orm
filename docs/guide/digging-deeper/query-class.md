# Query Class

The Query class is responsible for fetching data from the Vuex Store. When you fetch data through Model methods, such as `User.find(1)`, it uses the Query class underneath to find and filter data.

Usually, you won't need to care about the Query class as long as you keep using this methods. However, when you would like to add global features when querying data, it might be useful to use lifecycle hooks. This is especially useful when you want to create a plugin for the Vuex ORM.

## Lifecycle Hook Types

Query class comes with the following lifecycle hooks.

- `beforeProcess` – Called before data gets filtered.
- `afterWhere` – Called right after the data gets filtered by `where` clause.
- `afterOrderBy` – Called right after the data gets sorted by `orderBy` clause.
- `afterLimit` – Called right after the data gets limited by `limit` and `offset` clause.

By registering callbacks to each hook, you can manipulate the result from the method call.

### Lifecycle Hook Methods

Like JavaScript events, you can use the **Query.on()** to register a hook, and **Query.off()** to remove the hook.

```js
const hookId = Query.on('afterWhere', callback())

Query.off(hookId)
```

#### Lifecycle Hook Scope

By default, all hooks are registered globally within the Query class and run on all instances within your application.

If you only want to register a hook to be available for the next query() call, you can add the third optional parameter **true** to have the Query class automatically remove your hook after the next query() method call.

```js
Query.on('beforeProcess', callback(), true)
```

### Lifecycle API

**Query.on**(type, callback, once?): hookId: number
- `type` (string) - must be one of [beforeProcess, afterWhere, afterOrderBy, afterLimit]
- `callback` (function) - must be function
- `once` (boolean, optional) - default false

**Returns**: number: < HookId >

### Examples

**Register a beforeProcess hook to map all records**

```js
import { Query } from 'vuex-orm/core'

// Add extra `hooked` field on each record.
const hookMapRecordsId = Query.on('beforeProcess', (records, entity) => {
  return records.map((record) => {
    record.hooked = true
    return record
  })
})

const result = User.all()

/* result
  [
    { id: 1, name: 'John Doe', hooked: true },
    { id: 2, name: 'Jane Doe', hooked: true }
  ]
*/

const hookRemoved = Query.off(hookMapRecordsId)

/* hookRemoved = true */
```

**Soft Delete Hook Sample Implementation**

```js
import { Query } from 'vuex-orm/core'
import store from '@/store'

const data = [
  { id: 1, name: 'John Doe', deletedAt: null },
  { id: 1, name: 'Bob Doe', deletedAt: new Date() }
]

User.create({ data: data })

let softDeleteHookId

const softDeleteCallback = function (records) {
  return records.filter(r => !r.deletedAt)
}
const deletedRecordsCallback = function (records) {
  return records.filter(r => !!r.deletedAt)
}

// register global hook
softDeleteHookId = Query.on('beforeProcess', softDeleteCallback)

// query data
const results = User.query().all()
/* results
[{ id: 1, name: 'John Doe', deletedAt: null }]
 */

// *** switch to showing only deleted items **
Query.off(softDeleteHookId) // remove global callback
Query.on('beforeProcess', deletedRecordsCallback, true) // run only once

const deletedResults = User.query().all()
/* deletedResults
[{ id: 2, name: 'Bob Doe', deletedAt: '2018-03-15TZ00:00:00' }]
 */

// re-initialize global soft deletes
softDeleteHookId = Query.on('beforeProcess', softDeleteCallback)
```
