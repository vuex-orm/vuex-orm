# API: Model

## Instance Methods

- **`$fields()`**

  Get the `fields` object of the model.

  ```js
  import { Model } from 'vuex-orm'

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

- **`$id()`**

  Get the value of the primary key.

  ```js
  import { Model } from 'vuex-orm'

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
