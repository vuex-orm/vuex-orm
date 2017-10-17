# Model: Getting Started

## Defining Models

Models are the definition of the data schema that will be handled by Vuex ORM. Every Model should extend `vuex-orm/lib/Model`.

```js
import Model from 'vuex-orm/lib/Model'

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

### Model Conventions

There are 2 required properties when you define a model.

#### Entity Names

`static entity` will be used as state name of Vuex Store.

```js
import Model from 'vuex-orm/lib/Model'

class User extends Model {
  static entity = 'users'
}
```

So in this case, state for the User model will be accessible by `store.state.entities.users`. Notice there is `entities` state. This state is created by Vuex ORM automatically and all of the Model data will be stored under this namespace.

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

#### Fields

`static fields()` should return the schema of the data.

```js
import Model from 'vuex-orm/lib/Model'

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

You can also define a relationship between deferent models. For that, please take a look at [Relationship documentation]('relationship.md').
