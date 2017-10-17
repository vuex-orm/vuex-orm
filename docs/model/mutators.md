# Model: Mutators

## Date Mutators

By using `this.date()` attribute type, Vuex ORM will convert the field into [Moment](http://momentjs.com) instance, which provides great flexibility handling on date object.

```js
import Model from 'vuex-orm/lib/Model'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      created_at: this.date(null)
    }
  }
}

const user = new User({ id: 1, name: 'John', created_at: '1985-10-10 00:00:00' })

user.created_at.format('MMM D, YYYY')

// Oct 10, 1985
```
