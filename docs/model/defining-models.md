# Model: Defining Models

Models are the definition of the data schema that will be handled by Vuex ORM. Every Model should extend Vuex ORM `Model`.

```js
import { Model } from 'vuex-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}
```

## Model Conventions

There are 2 required properties you must set when defining a model.

`static entity` will be used as state name of Vuex Store.

```js
import { Model } from 'vuex-orm'

class User extends Model {
  static entity = 'users'
}
```

In above example, state for the User model will be accessible by `store.state.entities.users`. Notice there is `entities` state. This state is created by Vuex ORM automatically and all of the Model data will be stored under this namespace.

Overall state structure will look like this.

```js
// Inside Vuex Store.
{
  entities: {
    users: {
      // ...
    }
  }
}
```

`static fields()` should return the schema of the data.

```js
import { Model } from 'vuex-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}
```

For this example, User model has `id` and `name` fields. The key represents the name of the field (as database's column) and value represents its type of the field. The User model uses `this.attr()` for both id and name. This is the most generic type of the field and the argument is the default value that will be used when instantiating the model class.

You can also define special attributes or a relationship between deferent models. For that, please take a look at the corresponding section.

- [Attributes](attributes.md)
- [Relationship](relationship.md)

These fields are going to be attached as instance property when instantiating the model.

```js
const user = new User({ id: 1, name: 'John Doe' })

user.id   // 1
user.name // 'John Doe'
```

## Other Optional Fields

### Primary Key

Vuex ORM will assume that each data has a primary key named `id`. You may define a `static primaryKey` property to override this convention.

```js
import { Model } from 'vuex-orm'

class User extends Model {
  static entity = 'users'

  static primaryKey = 'my_id'

  static fields () {
    return {
      my_id: this.attr(null),
      name: this.attr('')
    }
  }
}
```
