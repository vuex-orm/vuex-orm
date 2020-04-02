# Inserting & Updating

You may insert new data or update existing data through various Model methods. All data created through Vuex ORM gets persisted to Vuex Store.

## Inserts

To create new data, you can use the `insert`, `create` , and `new` methods. They all insert new records to the Vuex Store but behave in a slightly different manner.

The `insert` method will simply insert new records. You should pass an object containing records in `data` key to the method.

```vue
<script>
import User from '@/models/User'

export default {
  created () {
    User.insert({
      data: { id: 1, name: 'John' }
    })
  } 
}
</script>
```

You may also pass an array of records.

```js
User.insert({
  data: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Johnny' }
  ]
})
```

After the insert, inside Vuex Store would look something like this.

```js
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' },
        2: { id: 2, name: 'Jane' },
        3: { id: 3, name: 'Johnny' }
      }
    }
  }
}
```

The `create` method would work almost identical to `insert`. The argument is also the same.

```js
User.create({
  data: { id: 1, name: 'John' }
})
```

The difference between the `insert` and `create` method is whether to keep existing data or not. The `create` method is going to replace all existing data in the store and replace with the given data, while `insert` will create new data and leave existing data as is.

```js
// Let's say this is the initial State.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' }
      }
    }
  }
}

// `insert` is going to insert a new record, and keep existing data.
User.insert({
  data: { id: 2, name: 'Jane' }
})

// State after `insert`.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' },
        2: { id: 2, name: 'Jane' }
      }
    }
  }
}

// `create` is going to replace all existing data with new data.
User.create({
  data: { id: 3, name: 'Johnny' }
})

// State after `create`.
{
  entities: {
    users: {
      data: {
        3: { id: 3, name: 'Johnny' }
      }
    }
  }
}
```

When performing `insert`, if there is existing data with the same ID, the record will get overwritten.

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' }
      }
    }
  }
}

// `insert` is going to overwrite the record with the same ID.
User.insert({
  data: { id: 1, name: 'Jane' }
})

// State after `insert`.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'Jane' }
      }
    }
  }
}
```

Finally, with the `new` method, you can create a new record with all fields filled by default values. Let's say you have the following Model defined.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.uid(),
      name: this.string('Default Name')
    }
  }
}
```

By calling `new` method on the User Model would create a new record of:

```js
// Create new data with default values.
User.new()

// State after `new`
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'Default Name' }
      }
    }
  }
}
```

### Default Values

If you pass an object that has missing fields defined in the model, that field will be automatically generated with the default value defined in the model.

```js
// When you have this model.
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      active: this.attr(false)
    }
  }
}

// If you insert object that misses some fields...
User.create({
  data: { id: 1, name: 'John Doe ' }
})

// Those missing fields will be present with its default value.
{
  entities: {
    users: {
      data: {
        1: {
          id: 1,
          name: 'John Doe',
          active: false
        }
      }
    }
  }
}
```

Note that records should always be created with the primary key value provided. Leaving the primary key empty (`''`, `undefined` or `null`) will result in index keys `_no_key_X` and a high probability of inconsistent behavior. This also means that a primary key of type `uid` is recommended when using the `new` method. [See here](../model/defining-models.md#primary-key-and-index-key) to learn more about primary key and index key.

### Inserting Relationships

If you pass data with relationships to the `insert` or `create` method, those relationships will be normalized and inserted to the store.

For "Single Relationship", such as "Has One" and "Belongs To", the data should contain an object to its relational field. Let's say you have the following Model definition, where Post Model "Belongs To" User Model.

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

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      title: this.attr(''),
      author: this.belongsTo(User, 'user_id')
    }
  }
}
```

You may insert Post data with its related User like below example.

```js
// Create Post data with its related User.
Post.insert({
  data: {
    id: 1,
    user_id: 1,
    title: 'Post title.',
    author: {
      id: 1,
      name: 'John Doe '
    }
  }
})

// State after `insert`.
{
  entities: {
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title' }
      }
    },
    users: {
      data: {
        1: { id: 1, name: 'John Doe' }
      }
    }
  }
}
```

For "Many Relationship", for example, "Has Many", the data should contain an array of records to its relational field. Let's say this time you have the following Model definition, where User Model "Has Many" Post Model.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      posts: this.hasMany(Post, 'user_id')
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

Now you may insert User data with many Post data as same as "Single Relationship".

```js
// Create User data with its related Post data.
User.insert({
  data: {
    id: 1,
    name: 'John Doe ',
    posts: [
      { id: 1, user_id: 1, title: 'Post title 1' },
      { id: 2, user_id: 1, title: 'Post title 2' }
    ]
  }
})

// State after `insert`.
{
  entities: {
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title 1' }
        2: { id: 2, user_id: 1, title: 'Post title 2' }
      }
    },
    users: {
      data: {
        1: { id: 1, name: 'John Doe' }
      }
    }
  }
}
```

The insertion method works for all relationship types including complex ones such as "Belongs To Many" or "Morph Many". Because in the end, all relationships are either "Single" or "Many" from the data tree structure point of view. Vuex ORM will try its best to normalize the data and store each relationship separately into the store.

Though there are few things that you should know about when inserting relationship in a slightly complex manner.

### Inserting Many To Many Relationships

Since 0.36.0+, when inserting many-to-many relationships such as `belongsToMany` or `morphToMany`, any data nested under the `pivot` attribute will be inserted into intermediate models.

Let's take a look at an example. Here we have `User` belonging to many `Role` through `RoleUser`.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
    }
  }
}

class Role extends Model {
  static entity = 'roles'

  static fields () {
    return {
      id: this.attr(null)
    }
  }
}

class RoleUser extends Model {
  static entity = 'role_user'

  static primaryKey = ['role_id', 'user_id']

  static fields () {
    return {
      id: this.attr(null),
      role_id: this.attr(null),
      user_id: this.attr(null),
      level: this.number(1)
    }
  }
}
```

Having these structures, you may include intermediate data (`RoleUser` data) under `pivot` attribute.

```js
// Create user data with nested roles and its intermediate data.
User.insert({
  data: {
    id: 1,
    roles: [
      {
        id: 1,
        pivot: { id: 1, level: 2 }
      },
      {
        id: 2,
        pivot: { id: 2, level: 3 }
      }
    ]
  }
})

// State after `insert`.
{
  entities: {
    users: {
      1: { id: 1 }
    },
    roles: {
      1: { id: 1 },
      2: { id: 2 }
    },
    role_user: {
      1: { id: 1, user_id: 1, role_id: 1, level: 2 },
      2: { id: 2, user_id: 1, role_id: 2, level: 3 }
    }
  }
}
```

Note that you may customize the name of `pivot` attributes by using the `as` method when defining the relationship.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      roles: this.belongsToMany(
        Role,
        RoleUser,
        'user_id',
        'role_id'
      ).as('permission')
    }
  }
}
```

In this case, you must pass intermediate data to the key that matches the customized name.

```js
User.insert({
  data: {
    id: 1,
    roles: [{
      id: 1,
      permission: { id: 1, level: 2 }
    }]
  }
})
```

### Generating Missing Foreign Keys

If data is missing its foreign keys, Vuex ORM will automatically generate them during the inserting process. For example, let's say you have the following Model definition.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      posts: this.hasMany(Post, 'user_id')
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

And if you try to insert User with Post without `user_id` key, Vuex ORM will generate `user_id` value automatically.

```js
// Create User data with its related Post data with `user_id` missing.
User.insert({
  data: {
    id: 1,
    name: 'John Doe ',
    posts: [
      { id: 1, title: 'Post title 1' },
      { id: 2, title: 'Post title 2' }
    ]
  }
})

// State after `insert`. See `user_id` is automatically generated.
{
  entities: {
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title 1' }
        2: { id: 2, user_id: 1, title: 'Post title 2' }
      }
    },
    users: {
      data: {
        1: { id: 1, name: 'John Doe' }
      }
    }
  }
}
```

### Generating Pivot Records

For relationships that require a "Pivot Entity" such as "Belongs To Many", Vuex ORM will create missing pivot records as well. Again, let's say you have the following Model definition.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
    }
  }
}

class Role extends Model {
  static entity = 'roles'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string('')
    }
  }
}

class RoleUser extends Model {
  static entity = 'role_user'

  static primaryKey = ['role_id', 'user_id']

  static fields () {
    return {
      role_id: this.attr(null),
      user_id: this.attr(null)
    }
  }
}
```

When inserting data, you insert User data and its related Role data but without RoleUser data. Still, in this case, Vuex ORM will generate required intermediate pivot records.

```js
// Insert User data with Role data.
User.insert({
  data: {
    id: 1,
    name: 'John Doe',
    roles: [
      { id: 1, name: 'admin' },
      { id: 2, name: 'operator' }
    ]
  }
})

// State after `insert`. See there's a intermediate `role_user` records.
{
  entities: {
    users: {
      1: { id: 1, name: 'John Doe' }
    },
    roles: {
      1: { id: 1, name: 'admin' },
      2: { id: 2, name: 'operator' }
    },
    role_user: {
      '[1,1]': { role_id: 1, user_id: 1 },
      '[2,1]': { role_id: 2, user_id: 1 }
    }
  }
}
```

However, note that there is a caveat with "Has Many Through" relationship. When creating data that contains "Has Many Through" relationship without intermediate pivot records, the intermediate record will not be generated. Let's say you have the following model definitions.

```js
class Country extends Model {
  static entity = 'countries'

  static fields () {
    return {
      id: this.attr(null),
      users: this.hasMany(User, 'country_id'),
      posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      country_id: this.attr(null),
      posts: this.hasMany(Post, 'user_id')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null)
    }
  }
}
```

And then you try to save the following data.

```js
Country.create({
  data: {
    id: 1,
    posts: [
      { id: 1 },
      { id: 2 }
    ]
  }
})
```

Vuex ORM will normalize the data and save them to the store as below.

```js
{
  countries: {
    data: {
      1: { id: 1 }
    }
  },
  users: {
    data: {}
  },
  posts: {
    data: {
      1: { id: 1, user_id: null },
      2: { id: 2, user_id: null }
    }
  }
}
```

See there is no users record, and `user_id` at `posts` becomes empty. This happens because Vuex ORM wouldn't have any idea how post data relate to the intermediate User. Hence if you create data like this, you wouldn't be able to retrieve them by getters anymore. In such cases, it is recommended to create data with the intermediate records.

```js
Country.create({
  data: {
    id: 1,
    users: [
      {
        id: 1,
        posts: [
          { id: 1 }
        ]
      },
      {
        id: 2,
        posts: [
          { id: 2 }
        ]
      }
    ]
  }
})
```

### Get Newly Inserted Data

Both `insert` and `create` return the inserted data as a Promise so that you can get them as a return value. The return value will contain all of the data that was created.

```js
User.create({
  data: { id: 1, name: 'John Doe' }
}).then((entities) => {
  console.log(entities)
})

/*
  {
    users: [
      { id: 1, name: 'John Doe' }
    ]
  }
*/
```

If you prefer to use [async / await](https://tc39.github.io/ecmascript-asyncawait), then you can compose inserts like this.

```js
const entities = await User.create({
  data: { id: 1, name: 'John Doe' }
})

/*
  {
    users: [
      { id: 1, name: 'John Doe' }
    ]
  }
*/
```

Note that the return value will be in normalized shape. For example, when you insert data with relationships, those relationships are detached from each other.

```js
const entities = await User.create({
  data: {
    id: 1,
    name: 'John Doe',
    posts: [
      { id: 1, user_id: 1, title: 'Post title 1' },
      { id: 2, user_id: 1, title: 'Post title 2' }
    ]
  }
})

/*
  {
    users: [
      { id: 1, name: 'John Doe' }
    ],
    posts: [
      { id: 1, user_id: 1, title: 'Post title 1' },
      { id: 2, user_id: 1, title: 'Post title 2' }
    ]
  }
*/
```

The `new` method will also return the newly created record, but it'll return only one record since it's obvious that there's no relational data.

```js
const user = await User.new()

// { id: 1, name: 'Default Name' }
```

## Updates

To update existing data, you can do so with the `update` method. Following example is some simple Vue Component handling data update with form data. The `update` method takes `where` condition and `data` as payload.

```vue
<template>
  <div>
    <label>Name</label>
    <input :value="user.name" @input="updateName">
  </div>
</template>

<script>
import User from '@/models/User'

export default {
  computed: {
    user () {
      return User.find(1)
    }
  },

  methods: {
    updateName (e) {
      User.update({
        where: 1,
        data: {
          name: e.target.value
        }
      })
    }
  }
}
</script>
```

`where` condition can be a `Number` or a `String` representing the value of the primary key of the Model. `data` is the data you want to update. Let's see some example here to understand how it works.

```js
// Initial State.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20 },
      2: { id: 2, name: 'Jane', age: 30 }
    }
  }
}

// Update data.
User.update({
  where: 2,
  data: { age: 24 }
})

// State after `update`
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20 },
      2: { id: 2, name: 'Jane', age: 24 }
    }
  }
}
```

You may also pass `Function` to the `where` field to determine the target data. The `Function` takes the record as the argument and must return `Boolean`. This approach also lets you update multiple records at once.

```js
// Initial State.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20, active: false },
      2: { id: 2, name: 'Jane', age: 20, active: false },
      3: { id: 3, name: 'Johnny', age: 30, active: false }
    }
  }
}

// Update via function.
User.update({
  where: (user) => {
    return user.age === 20
  },

  data: { active: true }
})

// State after `update`.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20, active: true },
      2: { id: 2, name: 'Jane', age: 20, active: true },
      3: { id: 3, name: 'Johnny', age: 30, active: false }
    }
  }
}
```

`data` also could be a `Function`. The `Function` will receive the target record as an argument. Then you can modify any properties. This is especially useful when you want to interact with the field that contains `Array` or `Object`.

```js
// Initial State.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20, keywords: ['sales'] },
      2: { id: 2, name: 'Jane', age: 30, keywords: ['marketing'] }
    }
  }
}

// Update data via function.
User.update({
  where: 2,

  data (user) {
    user.name = 'Jane Doe'
    user.keywords.push('pr')
  }
})

// State after `update`.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20, keywords: ['sales'] },
      2: { id: 2, name: 'Jane Doe', age: 30, keywords: ['marketing', 'PR'] }
    }
  }
}
```

You may also pass the whole data object as a single argument. In this case, the primary key must exist in the data object.

```js
// Initial State.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20 },
      2: { id: 2, name: 'Jane', age: 30 }
    }
  }
}

// Update by passing data object.
User.update({
  id: 2, // <- Primary key must exist.
  age: 24
})

// State after `update`.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20 },
      2: { id: 2, name: 'Jane', age: 24 }
    }
  }
}
```

It is also possible to pass an array of objects to the `data` property when those objects contain the primary key.

```js
// Initial State.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20 },
      2: { id: 2, name: 'Jane', age: 30 },
      3: { id: 3, name: 'Harry', age: 37 }
    }
  }
}

// Update by passing an array of objects.
User.update({
  data: [
    { 
      id: 2, // <- Primary key must exist.
      age: 24
    },
    {
      id: 3,
      age: 40
    }
  ] 
})

// State after `update`.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20 },
      2: { id: 2, name: 'Jane', age: 24 },
      3: { id: 3, name: 'Harry', age: 40 }
    }
  }
}
```

### Updating Relationships

Updating relationships works the same as insert methods such as `insert` and `create`. Any data you pass to `data` field will be normalized and updated accordingly in Vuex Store. Note that you can't specify `where` field for relationships, so don't forget to include the primary key for the relationships.

```js
// Initial State.
{
  entities: {
    users: {
      1: { id: 1, name: 'John', age: 20 }
    },
    posts: {
      1: { id: 1, user_id: 1, title: 'Post title 1' },
      2: { id: 2, user_id: 1, title: 'Post title 2' }
    }
  }
}

// Update data with relationship.
User.update({
  where: 1,
  data: {
    name: 'John Doe',
    posts: [
      { id: 1, title: 'Edited post title' }
    ]
  }
})

// State after `update`.
{
  entities: {
    users: {
      1: { id: 1, name: 'John Doe', age: 20 }
    },
    posts: {
      1: { id: 1, user_id: 1, title: 'Edited post title' },
      2: { id: 2, user_id: 1, title: 'Post title 2' }
    }
  }
}
```

### Get Updated Data

Same as `insert` or `create`, the `update` method also returns updated data as a Promise. However, the data structure that will be returned is different depending on the use of the `update` method.

If you pass the whole object to the `update` method, it will return all updated entities.

```js
const user = await User.update({ id: 1, age: 24 })

/*
  {
    users: [{ id: 1, name: 'John Doe', age: 24 }]
  }
*/
```

When specifying id value in the `where` property, it will return a single item that was updated.

```js
const user = await User.update({
  where: 1,
  data: { age: 24 }
})

// { id: 1, name: 'John Doe', age: 24 },
```

When updating records by specifying a closure to the `where` property, the returned data will always be an array containing all updated data.

```js
const user = await User.update({
  where: record => record.age === 30,
  data: { age: 24 }
})

/*
  [
    { id: 1, name: 'John Doe', age: 24 },
    { id: 2, name: 'Jane Doe', age: 24 }
  ]
*/
```

## Insert or Update

The `insertOrUpdate` method will insert new data if any records do not exist in the store, and update the data of records that do exist.

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John', title: 'Sales' }
      }
    }
  }
}

// `insertOrUpdate` is going to add new data and update data.
User.insertOrUpdate({
  data: [
    { id: 1, name: 'Peter' },
    { id: 2, name: 'Hank' }
  ]
})

// State after `insertOrUpdate`.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'Peter', title: 'Sales' },
        2: { id: 2, name: 'Hank', title: null  }
      }
    }
  }
}
```

See how the `title` of the User ID of 1 is not affected. If we were using the `insert` method, both User ID 1 and 2 will have the `title` value set to `null` (the default value of the field).

The `insertOrUpdate` is also very useful when inserting dynamically embedded relationships. For example, if an API supports dynamic embedding of relationships and doesn't always return all relationships, the relationships would be emptied when missing on `insert`. This is because insertion methods, `insert`, `create` and `update`, will be applied for all nested relationships.

Let's see what we mean by this in the example. What happen if we were to `insert` User with Posts.

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' }
      }
    },
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title 1', body: 'Very long body...' }
      }
    }
  }
}

// We would destroy post's body field if we use `insert`.
User.insert({
  id: 1,
  name: 'John',
  posts: [
    { id: 1, user_id: 1, title: 'Post title 1' },
    { id: 2, user_id: 1, title: 'Post title 2' }
  ]
})

// State after `insert`.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' }
      }
    },
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title 1', body: null },
        2: { id: 1, user_id: 2, title: 'Post title 2', body: null }
      }
    }
  }
}
```

See `body` of Post ID of 1 got removed. This is because Post ID 1 got "inserted". This case, we want to "update" the posts. For these cases you can use the `insertOrUpdate` method:

```js
// Initial State.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' }
      }
    },
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title 1', body: 'Very long body...' }
      }
    }
  }
}

// Using `insertOrUpdate` will update any existing records while inserting new records that don't exist.
User.insertOrUpdate({
  id: 1,
  name: 'John',
  posts: [
    { id: 1, user_id: 1, title: 'Post title 1' },
    { id: 2, user_id: 1, title: 'Post title 2' }
  ]
})

// State after `insertOrUpdate`.
{
  entities: {
    users: {
      data: {
        1: { id: 1, name: 'John' }
      }
    },
    posts: {
      data: {
        1: { id: 1, user_id: 1, title: 'Post title 1', body: 'Very long body...' },
        2: { id: 1, user_id: 2, title: 'Post title 2', body: null }
      }
    }
  }
}
```

## Insert Method for Relationships

As described at "Insert or Update" section, when you insert data with related records included, all of the related records will be inserted using the base method that was called. For example, if you call the `create` method, all of the related records get "created" into the store.

Sometimes you might want the option to choose how Vuex ORM inserts data into the store depending on the relationship. For example, you might want to "create" users but "insert" posts. You may do so by passing additional options to the method.

```js
// `create` users but `insert` posts.
User.create({
  data: [...],
  insert: ['posts']
})

// `insert` users but `create` posts and `comments`.
User.insert({
  data: [...],
  create: ['posts', 'comments']
})
```

The available options are:

- `create`
- `insert`
- `update`
- `insertOrUpdate`

Note that the value passed to those `create` or `insert` options should be **the entity name of the Model**, _not_ the name of the field that defines the relationship in the model.

## Save Method

The `$save` method at Model allows you to insert or update the record to the Store.

```js
const user = new User()

user.name = 'John Doe'

user.$save()
```

Note that `$save` method will only save the model itself. It wouldn't save any relationships attached to the Model.

Be careful when using the `$save` method, that you might like the syntax due to its consistency with other ORMs such as Laravel Eloquent, remember you should not mutate the record inside the store. Simply put, never mutate the record you fetched by the getters.

```js
const user = User.find(1)

// Never do this!
user.name = 'John Doe'
```

The perfect place to use `$save` method is when you need to create a fresh new record inside Vue Component like below example.

```js
export default {
  data () {
    return {
      user: new User()
    }
  },

  methods: {
    updateName (e) {
      this.user.name = e.target.value
    },

    save () {
      this.user.$save()
    }
  }
}
```

## Dispatching Actions from Root Module

You can dispatch action from root module as well. With this syntax, you must specify the entity manually by passing `entity` field.

```js
store.dispatch('entities/create', { entity: 'users', data: { /* ... */ } })

// Above is equivalent to this.
User.create({ data: { /* ... */ } })
```

Note that since the root module needs `entity`, you can't dispatch `update` action through root by passing the condition directly.

```js
// This would not work.
store.dispatch('entities/update', { id: 2, age: 24 })

// you must have entity field.
store.dispatch('entities/update', {
  entity: 'users',
  where: 2,
  data: { age: 24 }
})
```
