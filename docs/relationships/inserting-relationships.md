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
