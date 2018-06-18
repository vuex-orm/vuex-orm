# Models

Models are the definition of the data schema that will be handled by Vuex ORM. Every Model should extend Vuex ORM `Model`.

```js
import { Model } from '@vuex-orm/core'

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

There are 2 required properties you must set when defining a model, `static entity` and `static fields()`.

### Entity Name

`static entity` will be used as state name of Vuex Store.

```js
import { Model } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'
}
```

In above example, state for the User model will be accessible by `store.state.entities.users`. Notice there is `entities` state. This state is created by Vuex ORM automatically, and all of the Model data will be stored in this namespace. Please take a look at [Modules And Store](modules-and-store.md) to learn more about how Vuex ORM interact with Vuex Store.

### Fields

`static fields()` should return the schema of the data.

```js
import { Model } from '@vuex-orm/core'

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

These fields are going to be attached as instance property when instantiating the model.

```js
const user = new User({ id: 1, name: 'John Doe' })

user.id // <- 1
user.name // <- 'John Doe'
```

## Other Optional Fields

### Primary Key

Vuex ORM will assume that each data has a primary key named `id`. You may define a `static primaryKey` property to override this convention.

```js
import { Model } from '@vuex-orm/core'

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

You can also define a composite primary key by passing array of keys.

```js
import { Model } from '@vuex-orm/core'

class Vote extends Model {
  static entity = 'users'

  static primaryKey = ['user_id', 'vote_id']

  static fields () {
    return {
      user_id: this.attr(''),
      vote_id: this.attr('')
    }
  }
}
```

## Attributes

There are several model attributes you can use to define model fields.

## Generic Type

Use `this.attr()` method to define the most generic field. The argument is the default value of the field which will be used when creating a new data if the field is not present.

```js
class User extends Model {
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('John Doe')
    }
  }
}
```

## Specific Types

You may use specific type attributes, `this.string()`, `this.number()`, and `this.boolean()` to cast the value to be those types. The argument is the default value.

```js
class User extends Model {
  static fields () {
    return {
      id: this.number(0),
      name: this.string('John Doe'),
      active: this.boolean(true)
    }
  }
}
```

Note that these attributes provide casting. It will convert for example `'0'` to be `0` or `1` to be `true`.

## Auto Increment Type

`this.increment()` method will generate field type which will be auto incremented. Autoincrement field must be a number and should not have arguments. The value of this field gets incremented when you create a new record.

```js
class User extends Model {
  static fields () {
    return {
      id: this.increment(),
      name: this.attr('')
    }
  }
}
```

## Relationships

You can a relationship between deferent models. To learn more, please take a look at [Defining Relationships](../relationships/defining-relationships.md).
