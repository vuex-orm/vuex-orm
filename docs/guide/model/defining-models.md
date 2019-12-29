# Defining Models

Models are the definition of the data schema that will be handled by Vuex ORM. You may define any number of Models depending on your needs. 

To define a Model, create a class that extend Vuex ORM `Model`.

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

## Entity Name

`static entity` will be used as the key for the state. You may think this as a table name for the database.

```js
class User extends Model {
  static entity = 'users'
}
```

In the above example, state for the User Model will be accessible by `store.state.entities.users`. Notice there is an `entities` state. This state is created by Vuex ORM automatically, and all of the Model data will be stored in this namespace.

> You may change the default namespace (`entities`) to something else when installing Vuex ORM to Vuex. Please visit [Database Registration](/guide/model/database-registration) to learn how.

## Fields

`static fields()` should return the schema of the data. Like `static entity`, you may think this as columns for the dababase.

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

More importantly, these fields are used when inserting records into the Vuex Store. It would like this. We'll describe that in more detailed at [Inserting & Updating section](../data/inserting-and-updating).

There are several attributes you can use to define model fields. We'll describe each attribute in the following section.

## Field Attributes

There're several attributes you can use to declare field types. Let's take a look at what types we have.

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

### Primitive Types

You may use primitive type attributes, `this.string()`, `this.number()`, and `this.boolean()`. These attributes provide casting that will convert the given value to the specified type. For example, `'0'` to be `0` or `1` to be `true`. Same as `this.attr()`, the argument is the default value.

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

Note that these attributes will *not validate* the field value. It's going to *cast* the value. For example, if you pass `'John Doe'` to the `this.boolean()` field, the value will cast to `true`. If you pass `0`, it becomes `false`. The behavior is pretty much same as JavaScript native primitive functions, `String()`, `Number()`, and `Boolean()`.

So if you pass `null` value to the `this.number()` field, for example, it becomes `0`. If you want to accept `null` as a value, you may call `nullable` method on these attributes.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(null).nullable(),
      name: this.string(null).nullable(),
      active: this.boolean(null).nullable()
    }
  }
}
```

### UID Type

The `this.uid()` method generates a Unique ID if the field is not present.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.uid(),
      name: this.string('')
    }
  }
}
```

This attribute will generate a unique string value that looks like this.

```js
const user = new User()

user.id // <- '$uid32'
```

The default UID generation is a really simple one. It will have an incremented number with `$uid` prefix. It's going to be unique for single client usage, but it's not a Universally Unique ID (UUID).

If you need stronger ID generation (like UUID or CID), you can pass your desired function that returns the ID.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.uid(() => uuid())
    }
  }
}
```

### Relationships

You can define a relationship between different models by relational attributes such as `this.hasMany()` or `this.belongsTo()`. To learn more, please take a look at [Defining Relationships](relationships.md).

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

### Primary Key and Index Key

Since records are stored using the value of the primary key for the index key in the Vuex Store, **it's recommended that records always have a primary key**. If no primary key is provided, Vuex ORM will generate a unique ID for all primary keys automatically.

Given the models `User` and `UserVote` defined above, creating records without a primary key would result in the following data structure.

```js
User.insert({
  data: [
    { my_id: 1, name: 'John Doe' },
    { name: 'Jane Doe' }
  ]
})

/*
{
  entities: {
    users: {
      data: {
        1: { my_id: 1, name: 'John Doe' },
        $uid1: { my_id: '$uid1', name: 'Jane Doe' }
      }
    }
  }
}
*/
```

See how Vuex ORM generated `$uid1` value at `my_id` field. The generation mechanism is as same as when you set `this.uid` field type to the `my_id` field.

Remember, Vuex ORM requires all records to have its own primary key. If you need a primary key to be generated uniquely when inserting them, it's better to define such a field as `this.uid` for better readability.
