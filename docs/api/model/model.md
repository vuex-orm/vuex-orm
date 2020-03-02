# Model

## Static Properties

### `entity`

- **Type**: `string`

  The name of the module under which a model will store entity data.

- **See also**: [Defining Models: Entity Name](/guide/model/defining-models.md#entity-name)

### `baseEntity`

- **Type**: `string`

  The reference to the base entity name if the model extends another model. This is usually defined when using [Single Table Inheritance](/guide/model/single-table-inheritance.md).

### `primaryKey`

- **Type**: `string | Array<string> = 'id'`

  The primary key to be used for the model. This defaults to `id` and can be overridden to suit the needs of your application.

  Composite primary keys can be defined by setting this property as an array of keys.

- **See also**: [Defining Models: Primary Key](/guide/model/defining-models.md#primary-key)

### `typeKey`

- **Type**: `string = 'type'`

  The discriminator key to be used for the model when using [Single Table Inheritance](/guide/model/single-table-inheritance.md).

- **See also**: [Discriminator Field Override](/guide/model/single-table-inheritance.md#discriminator-field)


## Static Methods

### `new`

- **Type**: `() => Promise`

  Create new records with all declared fields filled with their default values.

  Returns a Promise that resolves with the newly created record.

- **See also**: [Inserting & Updating](/guide/data/inserting-and-updating.md#inserting-updating)

### `create`

- **Type**: `(payload: Object | Array, options?: Object) => Promise`

- **Options**: `{ create, insert, update, insertOrUpdate }`

  Create records by replacing all existing entity data in the store with the payload provided. This will flush all existing records before inserting new records.

  The `options` argument notifies Vuex ORM on how to handle any relationships. [Details](/guide/data/inserting-and-updating.md#insert-method-for-relationships).

  Returns a Promise that resolves with created records.

- **See also**: [Inserting & Updating](/guide/data/inserting-and-updating.md#inserting-updating)

### `insert`

- **Type**: `(payload: Object | Array, options?: Object) => Promise`

- **Options**: `{ create, insert, update, insertOrUpdate }`

  Insert records by adding new records and replacing any existing records that
  match the primary key of the records provided in the payload.

  The `options` argument notifies Vuex ORM on how to handle any relationships. [Details](/guide/data/inserting-and-updating.md#insert-method-for-relationships).

  Returns a Promise that resolves with inserted records.

- **See also**: [Inserting & Updating](/guide/data/inserting-and-updating.md#inserting-updating)

### `update`

- **Type**: `(payload: Object | Array | (model) => void, options?: Object) => Promise`

- **Condition**: `{ where: number | string | (model) => boolean }`

- **Options**: `{ create, insert, update, insertOrUpdate }`

  Update existing records that matches the primary key against the `where`
  condition. In the absence of a condition, records will be matched 
  against primary keys in the payload itself.

  The `where` condition may also be a closure for pragmatic conditionals.

  ```js
  User.update(
    { name: 'Johnny Doe' },
    { where: (user) => user.name === 'John Doe' }
  )
  ```

  A closure may also be passed as the payload, only when accompanied by a `where`
  condition, as an alternate syntax for handling record data.

  ```js
  User.update((user) => { user.name = 'Johnny Doe' }, where: 1 })
  ```

  Additional `options` provided notifies Vuex ORM on how to handle any relationships. [Details](/guide/data/inserting-and-updating.md#insert-method-for-relationships).

  Returns a Promise that resolves with updated records.

- **See also**: [Inserting & Updating](/guide/data/inserting-and-updating.md#updates)

### `insertOrUpdate`

- **Type**: `(payload: Object | Array, options?: Object) => Promise`

- **Options**: `'create'` | `'insert'` | `'update'` | `'insertOrUpdate'`

  Inserts new records and updates any existing. Similar to [insert](#insert) 
  except the payload is explored for records that require insertion and records
  that already exist and need only updating.

  Two mutations are committed to the store, one of which inserts records,
  and the other updates.

  The `options` argument notifies Vuex ORM on how to handle any relationships. [Details](/guide/data/inserting-and-updating.md#insert-method-for-relationships).

  Returns a Promise that resolves with inserted and/or updated records.

- **See also**: [Inserting & Updating](/guide/data/inserting-and-updating.md#insert-or-update)

### `delete`

- **Type**:
  - `(id: string | number | Array<number | string>) => Promise`
  - `(condtion: (model) => boolean): Promise`
  - `(payload: any): Promise`

  Delete entity records by primary key or condition.

  ```js
  // Delete by primary key
  User.delete(1)

  // Delete by composite primary key
  User.delete([1, 2])

  // Delete by conditional closure
  User.delete((user) => user.subscription === 'expired')
  ```

- **See also**: [Deleting](/guide/data/deleting.md)

### `deleteAll`

- **Type**: `() => Promise`

  Delete all entity records from the store.

- **See also**: [Delete All Data](/guide/data/deleting.md#delete-all-data)

### `all`

- **Type**: `() => Array`

  Get all entity records.

- **See also**: [Get All Data](/guide/data/retrieving.md#get-all-data)

### `find`

- **Type**: `(id: string | number | Array<number | string>) => Object | null`

  Find a record by primary key.

- **See also**: [Get Single Data](/guide/data/retrieving.md#get-single-data)

### `findIn`

- **Type**: `(idList: Array<number | string | Array<number | string>>) => Array`

  Find records by an array of primary keys.

- **See also**: [Get Multiple Data by Primary Keys](/guide/data/retrieving.md#get-multiple-data-by-primary-keys)

### `query`

- **Type**: `() => Query`

  Get a new [Query Builder](/guide/data/retrieving.md#query-builder) instance.

### `store`

- **Type**: `() => Vuex.Store`

  Get the Vuex Store instance.

### `database`

- **Type**: `() => Database`

  Get the database instance from store.

### `dispatch`

- **Type**: `(method: string, payload?: Object, options?: Object) => Promise`

  Dispatches a store action. The module namespace is generated automatically.

  ```js
  User.dispatch('create', { data: [...] })
  ```

- **See also**: [Call Module Methods From Model](/guide/digging-deeper/vuex-module.md#call-module-methods-from-model)

### `getters`

- **Type**: `(method: string) => any`

  Calls a store getter. The module namespace is generated automatically.

  ```js
  const users = User.getters('all')()
  ```

- **See also**: [Calling Getters](/guide/digging-deeper/vuex-module.md#calling-getters)

### `namespace`

- **Type**: `(method: string) => string`

  Creates a namespaced string respresentation for the given method. Useful when 
  dispatching actions or calling getters.

  ```js
  const method = User.namespace('create')

  // 'entities/users/create'
  ```

### `commit`

- **Type**: `(callback: (state: Object) => void) => void`

  Commits a store mutation. The module namespace is generated automatically.

  ```js
  User.commit((state) => { state.fetching = true })
  ```

- **See also**: [Mutating State](/guide/digging-deeper/vuex-module.md#mutating-state)

### `hydrate`

- **Type**: `(record?: Object) => Object`

  Fill any missing fields in the given record with the default values defined in the model schema. The return type is a plain object.

  ```js
  User.hydrate({ id: 1 })

  // { id: 1, name: 'Default Name' }
  ```

  Relational data will also be hydrated if it exists.

  ```js
  User.hydrate({
    id: 1,
    posts: [
      { id: 1, user_id: 1 },
      { id: 2, user_id: 1 }
    ]
  })

  /*
    {
      id: 1,
      name: 'Default Name',
      posts: [
        { id: 1, user_id: 1, title: 'Default Title' },
        { id: 2, user_id: 1, title: 'Default Title' }
      ]
    }
  */
  ```

  ::: tip
  Hydrating will not "normalize" the given data. It will fill any missing
  fields, but it will not attach correct id value to the foreign field, for
  example adding `id` value of the user to the `user_id` field of the post, or
  increment the value specified by the `uid` attribute.
  :::

### `getFields`

- **Type**: `() => Object`

  Get the fields definition of the model and its relations.

  ```js
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('John Doe')
      }
    }
  }

  const fields = (new User()).$fields()

  /*
  {
    id: {
      value: null,     // default value
      ...
    },
    name: {
      value: John Doe, // default value
      ...
    }
  }
  */
  ```


## Instance Properties

### `$id`

- **Type**: `string | null`

  Stores the value of the primary key. This is the generated index identifier for a
  record and returns a string representation of the primary key.

## Instance Methods

### `$create`

- **Type**: `(payload: Object | Array, options?: Object) => Promise`

- **Options**: `{ create, insert, update, insertOrUpdate }`

  The instance method of [create()](#create).

### `$insert`

- **Type**: `(payload: Object | Array, options?: Object) => Promise`

- **Options**: `{ create, insert, update, insertOrUpdate }`

  The instance method of [insert()](#insert).

### `$update`

- **Type**: `(payload: Object | Array | Function, options?: Object) => Promise`

- **Condition**: `{ where: number | string | (record) => boolean }`

- **Options**: `{ create, insert, update, insertOrUpdate }`

  The instance method of [update()](#update) with one exception:

  - Omitting a condition and primary key from the payload results in `where`
  using the primary key from the instance itself.

    ```js
    const user = User.find(1)

    user.$update({ name: 'Johnny Doe'})
    ```

    is equvalent to:

    ```js
    User.update({ name: 'Johnny Doe' }, { where: 1 })
    ```

### `$insertOrUpdate`

- **Type**: `(payload: Object | Array, options?: Object) => Promise`

- **Options**: `'create'` | `'insert'` | `'update'` | `'insertOrUpdate'`

  The instance method of [insertOrUpdate()](#insertorupdate).

### `$save`

- **Type**: `() => Promise`

  Persist the current instance to the store. This method uses the `insertOrUpdate`
  action internally and it is advised to use `$save()` where the model has been
  instantiated using the `new` operator.

  ```js
  const user = new User()

  user.name = 'John Doe'

  user.$save()
  ```

- **See also**: [Save Method](/guide/data/inserting-and-updating.md#save-method)

### `$delete`

- **Type**: `() => Promise`

  Delete the current instance record from the store.

### `$deleteAll`

- **Type**: `() => Promise`

  The instance method of [deleteAll()](#deleteall).

### `$all`

- **Type**: `() => Array`

  The instance method of [all()](#all).

### `$find`

- **Type**: `(id: string | number | Array<number | string>) => Object | null`

  The instance method of [find()](#find).

### `$findIn`

- **Type**: `(idList: Array<number | string | Array<number | string>>) => Array`

  The instance method of [findIn()](#findin).

### `$query`

- **Type**: `() => Query`

  The instance method of [query()](#query).

### `$store`

- **Type**: `() => Vuex.Store`

  Get the Vuex Store instance.

### `$dispatch`

- **Type**: `(method: string, payload?: Object, options?: Object) => Promise`

  The instance method of [dispatch()](#dispatch).

### `$getters`

- **Type**: `(method: string) => any`

  The instance method of [getters()](#getters).

### `$namespace`

- **Type**: `(method: string) => string`

  The instance method of [namespace()](#namespace).

### `$fields`

- **Type**: `() => Object`

  The instance method of [getFields()](#getfields).

### `$primaryKey`

- **Type**: `() => string | Array<string>`

  Get the primary key name for the model. Defaults to `id`.

### `$getAttributes`

- **Type**: `() => Object`

  Equivalent to [hydrate](#hydrate) except it is invoked on the current instance.

### `$toJson`

- **Type**: `() => Object`

  Serializes fields and their values into JSON.

- **See also**: [Serialization](/guide/digging-deeper/serialization.md)
