# Model: Mutators

Vuex ORM lets you define mutators which are going to modify the specific field when instantiating the Model. There are 2 ways to do this.

## Via Attribute

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

user.name

// JOHN DOE
```

## Via Mutators Method

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

user.name

// JOHN DOE
```

Note that if you have mutator defined at the 2nd argument of the `attr`, and also have mutators method with the same field name, the mutator at `attr` takes the precedent.
