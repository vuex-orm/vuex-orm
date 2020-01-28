---
sidebarDepth: 2
---

# Model

## Static Methods

### store

- **`store(): void`**

  Get Vuex Store instance.

  ```js
  const store = User.store()
  ```

### dispatch

- **`dispatch(method: string, payload?: any): Promise<any>`**

  Dispatch a store action. It will generate module namespace automatically.

  ```js
  User.dispatch('create', { data: { /* ... */ } })
  ```

### getters

- **`getters(method: string): any`**

  Call a getter. It will generate module namespace automatically.

  ```js
  const users = User.$getters('all')()
  ```

### namespace

- **`namespace(method: string): string`**

  Get namespaced string to be used for dispathing actions or calling getters.

  ```js
  const method = User.namespace('create')

  // 'entities/users/create'
  ```

### hydrate

- **`hydrate(record?: Record): Record`**

  Fill any missing fields in the given record with the default value defined in the model schema. Note that the returned object is not Model instance, it's plain object.

  ```js
  User.hydrate({ id: 1 })

  // { id: 1, name: 'Default Name' }
  ```

  If you pass relational data, those will be hydrated as well.

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

  > **NOTE:** `hydrate` method will not "normalize" the given data. It will fill any missing field, but it wouldn't attach correct id value to the foreign field, for example adding `id` value of the user to the `user_id` field of the post, or increment the value specified by the `uid` attribute.

## Instance Methods

### $store

- **`$store(): void`**

  Get Vuex Store instance.

  ```js
  const user = new User()

  const store = user.$store()
  ```

### $dispatch

- **`$dispatch(method: string, payload?: any): Promise<any>`**

  Dispatch a store action. It will generate module namespace automatically.

  ```js
  const user = new User()

  user.$dispatch('create', { data: { /* ... */ } })
  ```

### $getters

- **`$getters(method: string): any`**

  Call a getter. It will generate module namespace automatically.

  ```js
  const user = new User()

  const users = user.$getters('all')()
  ```

### $namespace

- **`$namespace(method: string): string`**

  Get namespaced string to be used for dispathing actions or calling getters.

  ```js
  const user = new User()

  const method = user.$namespace('create')

  // 'entities/users/create'
  ```

### $fields

- **`$fields(): Object`**

  Get the `fields` object of the model.

  ```js
  import { Model } from '@vuex-orm/core'

  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('John Doe')
      }
    }
  }

  const user = new User()

  user.$fields()

  /*
    {
      username: {
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

### $id

- **`$id(): any`**

  Get the value of the primary key.

  ```js
  import { Model } from '@vuex-orm/core'

  class User extends Model {
    static entity = 'users'

    static primaryKey = 'username'

    static fields () {
      return {
        username: this.attr(null),
        name: this.attr('')
      }
    }
  }

  const user = new User({ username: 'john-doe', name: 'John Doe' })

  user.$id()

  // 'john-doe'
  ```
