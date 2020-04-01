# Lifecycle Hooks

Vuex ORM triggers several lifecycle hooks while interacting with the store. Lifecycle hooks allow interaction with particular points in a query lifecycle, executing code each time a record is saved, updated or retrieved from the store.

Lifecycle hooks can be configured on models as static methods. Hooks registered on models are only triggered when they interact with the store.

There are two forms of lifecycle hooks. [Select Lifecycle Hooks](#select-hooks) and [Mutation Lifecycle Hooks](#mutation-hooks) both of which offer several hooks during store interaction.

**Example**:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    /* ... */
  }

  static beforeSelect (records) {
    return users.filter(user => user.admin !== 'admin')
  }

  static beforeCreate (record) {
    record.published = true
  }
}
```

::: tip
Lifecycle hooks are documented in order of execution.
:::

**See also**: [Global Hooks](/api/query/query.md#hooks)


## Select Hooks

Select lifecycle hooks are called when retrieving data from the store. They are triggered at several stages of the retrieval process. Each of these hooks receive an array of model instances that are being processed by a query. The number of instances may vary as it traverses through the selection process.

Select lifecycle hooks **must always return a collection** of model instances.

### `beforeSelect`

- **Type**: `(records: Array<Model>) => Array<Model>`

  Triggered at the very beginning of the retrieving process before any query filters are applied.

### `afterWhere`

- **Type**: `(records: Array<Model>) => Array<Model>`

  Triggered after any [where](/api/query/query.md#where) clauses have been applied.

### `afterOrderBy`

- **Type**: `(records: Array<Model>) => Array<Model>`

  Triggered after any [orderBy](/api/query/query.md#orderby) filters have been applied.

### `afterLimit`

- **Type**: `(records: Array<Model>) => Array<Model>`

  Triggered after any [limit](/api/query/query.md#limit) and [offset](/api/query/query.md#offset) filters have been applied.


## Mutation Hooks

Mutation lifecycle hooks are called when mutating data in the store.

### `beforeCreate`

- **Type**: `(record: Model | Array<Model>) => Model | Array<Model> | boolean`

  Triggered before records are inserted into the store. Returning `false` will prevent persisting records to the store.

### `afterCreate`

- **Type**: `(record: Model | Array<Model>) => void`

  Triggered after records are inserted into the store.

### `beforeUpdate`

- **Type**: `(record: Model | Array<Model>) => Model | Array<Model> | boolean`

  Triggered before records are updated in the store. Returning `false` will prevent persisting records to the store.

### `afterUpdate`

- **Type**: `(record: Model | Array<Model>) => void`

  Triggered after records are updated in the store.

### `beforeDelete`

- **Type**: `(record: Model | Array<Model>) => Model | Array<Model> | boolean`

  Triggered before records are deleted from the store. Returning `false` will prevent records being deleted from the store.

### `afterDelete`

- **Type**: `(record: Model | Array<Model>) => void`

  Triggered after records are deleted from the store.
