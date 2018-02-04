# Relationships: Inserting Relationships

When inserting data into the store through Vuex ORM action such as `create` and `insert`, it will normalize any relationship if data contains them.

Let's look at an example. Here we assume you have User and Post model. User relationship of `hasMany` with Posts.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      posts: this.hasMany(User, 'user_id')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      title: this.attr('')
    }
  }
}
```

And let's say you have following data that is user object but has related posts within. This is probably what you would get as a response from the API backend.

```js
{
  id: 1,
  name: 'John Doe',
  posts: [
    { id: 1, user_id: 1, title: '...' },
    { id: 2, user_id: 1, title: '...' },
    { id: 3, user_id: 1, title: '...' }
  ]
}
```

If you save this data to the store by `create` or `insert` action, it will be normalized and saved at under corresponding module.

```js
store.dispatch('entities/users/create', { data })

// Inside store.
{
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'John Doe' }
      }
    },
    posts: {
      data: {
        '1': { id: 1, user_id: 1, title: '...' },
        '2': { id: 2, user_id: 1, title: '...' },
        '3': { id: 3, user_id: 1, title: '...' }
      }
    }
  }
}
```

## Choosing The Insert Method Of The Related Records

When you insert data with related records included, all of the related records will be inserted using the base action that called. For example, if you call `create` actions, all of the related records get "created" into the store.

```js
store.dispatch('entities/users/create', { data })
```

Sometimes, you might want the option to choose how Vuex ORM inserts data into the store depending on the relationship. For example, you might want to "create" users but "insert" posts. You may do so by passing additional `create` or `insert` options to the action.

```js
// `create` users but `insert` posts.
store.dispatch('entities/users/create', {
  data: [{ ... }],
  insert: ['posts']
})

// `insert` users but `create` posts and `comments`.
store.dispatch('entities/users/create', {
  data: [{ ... }],
  create: ['posts', 'comments']
})
```

Note that the value passed to those `create` or `insert` options should be the name of the entity. Not the name of the field that defines the relationship in the User model.
