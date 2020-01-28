# Deleting

You can delete data from the store by calling the `delete` method on the Model class. The first argument is the ID—primary key value—of the record you want to delete.

```vue
<template>
  <ul>
    <li :key="user.id" v-for="user in users">
      {{ user.name }} <button @click="destroy(user.id)">DELETE</button>
    </li>
  </ul>
</template>

<script>
import User from '@/models/User'

export default {
  computed: {
    users () {
      return User.all()
    }
  },

  methods: {
    destroy (id) {
      User.delete(id)
    }
  }
}
</script>
```

You can also pass `Function` to the argument to specify which record to delete dynamically. The closure will take the record as an argument, and should return `Boolean`.

```js
// Delete all inactive users.
User.delete((user) => {
  return !user.active
})
```

Alternatively, you may call `$delete` method on a Model instance as well.

```js
const user = User.find(1)

user.$delete()
```

## Deleting Models with Composite Primary Key

If your model has a composite primary key, you can pass an array of ids. Let's say you have a Subscription model defined like this.

```js
import { Model } from '@vuex-orm/core'

class Subscription extends Model {
  static entity = 'users'

  static primaryKey = ['video_id', 'user_id']

  static fields () {
    return {
      video_id: this.attr(null),
      user_id: this.attr(null)
    }
  }
}
```

Then, you can delete Subscription records as below. Remember that the value order in the array is the same as the order you defined in your Model's primary key property. In this case it's `['video_id', 'user_id']`.

```js
// Delete subscription with video_id 1 and user_id 2.
Subscription.delete([1, 2])
```

## Delete All Data

You can delete all data in once by `deleteAll` action.

```js
// Delete all users.
User.deleteAll()
```

Even more, you may delete entire data by Vuex Action `dispatch('entities/deleteAll')`.

```js
// Delete entire data.
store.dispatch('entities/deleteAll')
```
