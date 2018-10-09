# Lifecycle Hooks

Vuex ORM fires several lifecycle hooks while dispatching actions, allowing you to hook into the particular points in a query lifecycle. Lifecycle hooks allows you to easily execute code each time a specific record is saved or updated in the database.

Supported lifecycle hooks are as follows.

- `beforeCreate`
- `afterCreate`
- `beforeUpdate`
- `afterUpdate`
- `beforeDelete`
- `afterDelete`

To get started with lifecycle hooks, you can define the action with one of each name listed above.

```js
const actions = {
  beforeCreate (record) {
    // Do something.
  },

  afterDelete (record) {
    // Do something.
  }
}
```

The first argument passed to the action is the action context that contains usual `state`, `commit` or `dispatch`. The second argument is the record that is to be created or has been created. All of the `after` hooks receive the record as a model instance.

## Modify the Record to be Saved

When in `beforeCreate` or `beforeUpdate`, you can modify the record to be saved to the state by returning a new record.

```js
const actions = {
  beforeCreate (context, record) {
    return {
      ...record,
      published: true
    }
  }
}
```

## Cancel the Mutation

If you pass `false` in `before` hooks, that record will not be persisted to the state.

```js
const actions = {
  beforeCreate (context, record) {
    return false
  }
}
```
