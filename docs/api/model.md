# Model

## Static Methods

- **`store(): void`**

  Get Vuex Store instance.

  ```js
  const store = User.store()
  ```

- **`dispatch(method: string, payload?: any): Promise<any>`**

  Dispatch a store action. It will generate module namespace automatically.

  ```js
  User.dispatch('create', { data: ... })
  ```

- **`getters(method: string): any`**

  Call a getter. It will generate module namespace automatically.

  ```js
  const users = User.$getters('all')()
  ```

- **`namespace(method: string): string`**

  Get namespaced string to be used for dispathing actions or calling getters.

  ```js
  const method = User.namespace('create')

  // 'entities/users/create'
  ```

## Instance Methods

- **`$store(): void`**

  Get Vuex Store instance.

  ```js
  const user = new User()

  const store = user.$store()
  ```

- **`$dispatch(method: string, payload?: any): Promise<any>`**

  Dispatch a store action. It will generate module namespace automatically.

  ```js
  const user = new User()

  user.$dispatch('create', { data: ... })
  ```

- **`$getters(method: string): any`**

  Call a getter. It will generate module namespace automatically.

  ```js
  const user = new User()

  const users = user.$getters('all')()
  ```

- **`$namespace(method: string): string`**

  Get namespaced string to be used for dispathing actions or calling getters.

  ```js
  const user = new User()

  const method = user.$namespace('create')

  // 'entities/users/create'
  ```

- **`$fields(): Object`**

  Get the `fields` object of the model.

  ```js
  import { Model } from '@vuex-orm/core'

  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null)
        name: this.attr('')
      }
    }
  }

  const user = new User()

  user.$fields()

  // { username: { ... }, name: { ... } }
  ```

- **`$id(): any`**

  Get the value of the primary key.

  ```js
  import { Model } from '@vuex-orm/core'

  class User extends Model {
    static entity = 'users'

    static primaryKey = 'username'

    static fields () {
      return {
        username: this.attr(null)
        name: this.attr('')
      }
    }
  }

  const user = new User({ username: 'john-doe', name: 'John Doe' })

  user.$id()

  // 'john-doe'
  ```
