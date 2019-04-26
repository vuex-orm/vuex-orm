# Defining Models

Models are the definition of the data schema that will be handled by Vuex ORM. You may define any number of Models depending on your needs. Every Model should extend Vuex ORM `Model`.

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

There are 2 required properties you **must** define when creating a model, `static entity` and `static fields()`.

## Entity Name

`static entity` will be used as the key for the state.

```js
class User extends Model {
  static entity = 'users'
}
```

In the above example, state for the User model will be accessible by `store.state.entities.users`. Notice there is an `entities` state. This state is created by Vuex ORM automatically, and all of the Model data will be stored in this namespace. Please take a look at [Modules And Store](modules-and-store.md) to learn more about how Vuex ORM interacts with the Vuex Store.

## Fields

`static fields()` should return the schema of the data.

```js
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

For this example, User model has `id` and `name` fields. The key represents the name of the field (as database's column) and value represents its type of the field. The User model uses `this.attr()` for both id and name. This is the most generic field type which accepts any value. The argument is the default value that will be used when instantiating the model class. In Vuex ORM, the field type such as `this.attr()` is called as Attribute.

These fields are going to be attached as instance properties when instantiating the model.

```js
const user = new User({ id: 1, name: 'John Doe' })

user.id   // <- 1
user.name // <- 'John Doe'
```

There are several attributes you can use to define model fields.

### Generic Type

Use `this.attr()` method to define the most generic field. The argument is the default value of the field which will be used when creating a new data if the field is not present.

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
```

You may also pass closure returning a value as default value.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('John Doe'),
      rand: this.attr(() => Math.random())
    }
  }
}
```

### Specific Types

You may use specific type attributes, `this.string()`, `this.number()`, and `this.boolean()`. These attributes provide casting that will convert the given value to the specified type. For example, `'0'` to be `0` or `1` to be `true`. The argument is the default value.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      name: this.string('John Doe'),
      active: this.boolean(true)
    }
  }
}
```

You may call `nullable` method on these attributes to let them accept `null` as a value.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0).nullable(),
      name: this.string('John Doe').nullable(),
      active: this.boolean(true).nullable()
    }
  }
}
```

Note that these attributes will *not validate* the field value. It's going to *cast* the value. For example, if you pass `'John Doe'` to the `this.boolean()` field, the value will cast to `true`. If you pass `0`, it becomes `false`. The behavior is pretty much same as JavaScript native primitive functions, `String()`, `Number()`, and `Boolean()`.

### Auto Increment Type

`this.increment()` method will generate field type which will be auto incremented. Autoincrement field must be a number and should not have arguments. The value of this field gets incremented when you create a new record.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.increment(),
      name: this.attr('')
    }
  }
}
```

### Relationships

You can define a relationship between different models by relational attributes such as `this.hasMany()` or `this.belongsTo()`. To learn more, please take a look at [Relationships](relationships.md).

## Primary Key

Vuex ORM will assume that each data has a primary key named `id`. You may define a `static primaryKey` property to override this convention.

```js
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

You can also define a composite primary key by passing an array of keys.

```js
class UserVote extends Model {
  static entity = 'user_vote'

  static primaryKey = ['user_id', 'vote_id']

  static fields () {
    return {
      user_id: this.attr(''),
      vote_id: this.attr('')
    }
  }
}
```
