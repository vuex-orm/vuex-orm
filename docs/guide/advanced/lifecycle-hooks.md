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
  beforeCreate (context, record) {
    // Do something.
  },

  afterDelete (context, record) {
    // Do something.
  }
}
```

The first argument passed to the action is the action context that contains usual `state`, `commit` or `dispatch`. The second argument is the record that is to be created or has been created. Note that the `record` is an instance of a model.

## Modify the Record to be Saved

When in `beforeCreate` or `beforeUpdate`, you can modify the record directly.

```js
const actions = {
  beforeCreate (context, model) {
    model.published = true
  }
}
```

## Cancel the Mutation

If you return false from `before` hooks, that record will not be persisted to the state.

```js
const actions = {
  beforeCreate (context, record) {
    if (record.doNotModify) {
      return false
    }
  }
}
```
