# Lifecycle Hooks

Vuex ORM fires several lifecycle hooks while interacting with the store, allowing you to hook into the particular points in a query lifecycle. Lifecycle hooks allow you to easily execute code each time a specific record is saved, updated or retrieved from the store.

Supported lifecycle hooks are as follows.

- `beforeSelect`
- `afterWhere`
- `afterWhere`
- `afterOrderBy`
- `afterLimit`
- `beforeCreate`
- `afterCreate`
- `beforeUpdate`
- `afterUpdate`
- `beforeDelete`
- `afterDelete`

## Defining Lifecycle Hooks

To define lifecycle hooks, you either define them as a static method at Model or register globally to Query class.

To define as a static method at Model, define a method with the corresponding lifecycle hook name.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    /* ... */
  }

  static beforeCreate (model) {
    // Do domething.
  }

  static afterDelete (model) {
    // Do domething.
  }
}
```

To define globally at Query class, import Query class and use `on` method.

## Select Lifecycle Hooks

Select lifecycle hooks are called when you retrieve data from the store. The corresponding hook name are `beforeSelect`, `afterWhere`, `afterOrderBy` and `afterLimit`. Each hook is called on each stage of the retrieving process allowing you to modified the query result as you wish.

- `beforeSelect` is called at the very beginning of the retrieving process. It contains all records that exist in the store.
- `afterWhere` is called right after `where` clause has been applied.
- `afterOrderBy` is called right after `orderBy` clause has been applied.
- `afterLimit` is called right after `limit` and `offset` clause has been applied.

Bellow example is a hook that will filter all non-admin users from the result.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    /* ... */
  }

  static beforeSelect (users) {
    return users.filter(user => user.admin !== 'admin')
  }
}
```

The first argument passed to the select lifecycle hook is a collection of records (model instances). Note that **you must always return a 
collection** from the hook.

When defining select lifecycle hook by Query class, you may use the 2nd argument to check on which entity the hooks have been executed.

```js
Query.on('beforeSelect', (records, entity) => {
  if (entity === 'users') {
    return users.filter(user => user.admin !== 'admin')
  }

  return records
})
```

## Mutation Lifecycle Hook

Mutation lifecycle hooks are called when you mutate data in the store. The corresponding hook name are `beforeCreate`, `afterCreate`, `beforeUpdate`, `afterUpdate`, `beforeDelete` and `afterDelete`.

When in `beforeCreate` or `beforeUpdate`, you can modify the record directly to mutate the data to be saved.

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    /* ... */
  }

  static beforeCreate (model) {
    model.published = true
  }
}
```

If you return false from `before` hooks, that record will not be persisted to the state.

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    /* ... */
  }

  static beforeUpdate (model) {
    if (model.doNotModify) {
      return false
    }
  }
}
```

## Global Lifecycle Hook

Like JavaScript events, you can use the `Query.on` to register a hook, and `Query.off()` to remove the hook.

```js
const hookId = Query.on('afterWhere', callback)

Query.off(hookId)
```

By default, all hooks are registered globally within the Query class and run on all instances within your application.

If you only want to register a hook to be available for the next query call, you can add the third optional parameter `true` to have the Query class automatically remove your hook after the next query method call.

```js
Query.on('beforeSelect', callback(), true)
```
