# Advanced: Accessors & Mutators

Accessors and mutators allow you to format attribute values of the data when retrieving them on a model instance. For example, you might want to modify some value to display nicely on the browser, but you still want to keep actual data as is inside Vuex Store.

## Defining Accessors

To define an accessor, just create a getter or a method in the model. In this example, we'll define `full_name` getter and `prefix` method to the User model.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      first_name: this.attr(''),
      last_name: this.attr('')
    }
  }

  /**
   * Get full name of the user.
   */
  get full_name () {
    return `${this.first_name} ${this.last_name}`
  }

  /**
   * Add given prefix to the user's full name.
   */
  prefix (prefix) {
    return `${prefix} ${this.full_name}`
  }
}
```

As you can see, these are just ordinally JavaScript class definition. You are free to define anything inside a class to modify data. You may access the value by simply calling those getter or methods.

```js
// Let's say you have following user inside Vuex Store.
{ id: 1, first_name: 'John', last_name: 'Doe' }

const user = store.getters['entities/users/find'](1)

user.full_name // <- 'John Doe'

user.prefix('Sir.') // <- 'Sir. John Doe'
```

## Defining Mutators

Vuex ORM lets you define mutators which are going to modify the specific field when instantiating the Model. The difference between accessors and mutators is that mutators are going to modify the field itself. There are two ways to do this.

### Via Attribute

You can pass a closure to the 2nd argument of `attr` method. The closure takes the corresponding value as an argument, and you can modify the value however you want.

```js
import { Model } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('', value => value.toUpperCase())
    }
  }
}

const user = new User({ name: 'john doe' })

user.name // <- JOHN DOE
```

### Via Mutators Method

You can also define mutators in one place by creating `static mutators` method. The `mutators` method should return an object containing a function with the key of the corresponding field.

```js
import { Model } from '@vuex-orm/core'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      name: this.attr('')
    }
  }

  static mutators () {
    return {
      name (value) {
        return value.toUpperCase()
      }
    }
  }
}

const user = new User({ name: 'john doe' })

user.name // <- JOHN DOE
```

Note that if you have mutator defined at the 2nd argument of the `attr`, and also have mutators method with the same field name, the mutator at `attr` takes the precedent.
