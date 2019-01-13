# Inserting and Updating Data

To insert or update data, you can call corresponding methods through Models. Let's see what kind of methodss are available.

## Inserts

To create a new data in the store, you can use `create`, `insert` and `new` method. For `create` and `insert`, you should pass an object with data key to the payload.

```js
User.create({
  data: { id: 1, name: 'John' }
})

// Or

User.insert({
  data: { id: 1, name: 'John' }
})
```

The difference between the `create` and `insert` methods is whether to keep existing data or not.

The `create` method is going to replace all existing data in the store and replace with the given data.

```js
// Initial State.
let state = {
  entities: {
    users: {
      data: {
        '2': { id: 2, name: 'Jane' }
      }
    }
  }
}

// `create` is going to replace all existing data with the new one.
User.create({
  data: { id: 1, name: 'John' }
})

// State after `create`.
state = {
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'John' }
      }
    }
  }
}
```

The `insert` method is going to insert data into the store while keeping existing data. If the inserting data has the same primary key as existing data, that data will be replaced with the new one.

```js
// Initial State.
let state = {
  entities: {
    users: {
      data: {
        '2': { id: 2, name: 'Jane' }
      }
    }
  }
}

// `insert` is going to leave existing data as is.
User.insert({
  data: {
    id: 1,
    name: 'John'
  }
})

// State after `insert`.
state = {
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'John' },
        '2': { id: 2, name: 'Jane' }
      }
    }
  }
}
```

Finally, with the `new` method, you can create a new record with all fields filled by default values.

```js
User.new()

// State after `new`
let state = {
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'Default Name' }
      }
    }
  }
}
```

### Insert Many Data

You can pass an array of objects to insert multiple data. It works for both `create` and `insert`.

```js
User.insert({
  data: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
})
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

// Missing field will be present with its default value.
let state = {
  entities: {
    users: {
      data: {
        '1': {
          id: 1,
          name: 'John Doe',
          active: false
        }
      }
    }
  }
}
```

### Get Newly Inserted Data

Both `create` and `insert` will return the created data as a Promise so that you can get them as a return value. The return value will contain all of the data that was created.

```js
User.create({
  data: { id: 1, name: 'John Doe' }
}).then((entities) => {
  console.log(entities)
})

/*
  {
    users: [User { id: 1, name: 'John Doe' }]
  }
*/
```

If you prefer to use [async / await](https://tc39.github.io/ecmascript-asyncawait), then you can compose inserts like this.

```js
const entities = await User.create({
  data: { id: 1, name: 'John Doe' }
})

console.log(entities)

/*
  {
    users: [User { id: 1, name: 'John Doe' }]
  }
*/
```

The `new` method will also return the newly created record, but it'll return only one since it's obvious that there's no relational data.

```js
const user = await User.new()

// User { id: 1, name: 'Default Name' }
```

### Inserting Relationships

If you pass data with relationships inside to the `create` or `insert` method, those relationships will be normalized and inserted to the store. Please see [Inserting Relationships](../relationships/inserting-relationships.md) for more detail.

## Updates

To update existing data, you can do so with the `update` method. The `update` method takes `where` condition and `data` as payload.

```js
User.update({
  where: 2,
  data: { age: 24 }
})
```

`where` condition can be a `Number` or a `String` representing the value of the primary key of the model or can be a `Function` to determine the target data. A `Function` takes the record as the argument and must return `Boolean`.

`data` is the data you want to update. `data` also could be just a plain object, or a `Function`.

Let's see some example here to understand how it works.

```js
// Initial State.
let state = {
  entities: {
    users: {
      '1': { id: 1, name: 'John', age: 20 },
      '2': { id: 2, name: 'Jane', age: 30 }
    }
  }
}

// Update data.
User.update({
  where: 2,
  data: { age: 24 }
})

// State after `update`
state = {
  entities: {
    users: {
      '1': { id: 1, name: 'John', age: 20 },
      '2': { id: 2, name: 'Jane', age: 24 }
    }
  }
}
```

You can pass a function to the `where` method to get more control. Remember to return boolean in this case.

```js
User.update({
  where: (record) => {
    return record.id === 2
  },

  data: { age: 24 }
})
```

Alternatively, you may pass the whole data object as a payload. In this case, the primary key must exist in the data object.

```js
User.update({
  id: 2, // <- Primary key must exist.
  age: 24
})

// Above code is equivalent to this.
User.update({
  where: 2,
  data: { age: 24 }
})

// And this is same too.
User.update({
  where (record) {
    return record.id === 2
  },

  data: { age: 24 }
})
```

Finally, you can pass `Function` to the `data`. The `Function` will receive the target record as an argument. Then you can modify any properties. This is especially useful when you want to interact with the field that contains `Array` or `Object`.

```js
User.update({
  where: 1,
  data (user) {
    user.name = 'Jane Doe'
    user.arrayField.push(1)
  }
})
```

### Updating Multiple Data

When specifying a `where` condition by a function, it's possible to update multiple records at once.

```js
// Initial State.
let state = {
  entities: {
    users: {
      '1': { id: 1, role: 'user', active: true },
      '2': { id: 2, role: 'user', active: true },
      '3': { id: 3, role: 'admin', active: true }
    }
  }
}

// Update data.
User.update({
  where (record) {
    return record.role === 'user'
  },

  data: { active: false }
})

// State after `update`.
state = {
  entities: {
    users: {
      '1': { id: 1, role: 'user', active: false },
      '2': { id: 2, role: 'user', active: false },
      '3': { id: 3, role: 'admin', active: true }
    }
  }
}
```

### Get Updated Data

The same as `insert` or `create`, the `update` method also returns updated data as a Promise. However, the data structure that will be returned is changed depending on the use of the `update` method.

If you pass the whole object to the `update` method, it will return all updated entities.

```js
User.update({ id: 1, age: 24 })
  .then((entities) => {
    console.log(entities)
  })

/*
  {
    users: [{ User { id: 1, name: 'John Doe', age: 24 }]
  }
*/
```

When specifying id value in the `where` property, it will return a single item that was updated.

```js
User.update({
  where: 1,
  data: { age: 24 }
}).then((user) => {
  console.log(user)
})

// User { id: 1, name: 'John Doe', age: 24 },
```

When updating many records by specifying a closure to the `where` property, the returned data will always be an array containing all updated data.

```js
User.update({
  where: record => record.age === 30,
  data: { age: 24 }
}).then((users) => {
  console.log(users)
})

/*
  [
    User { id: 1, name: 'John Doe', age: 24 },
    User { id: 2, name: 'Jane Doe', age: 24 }
  ]
*/
```

## Insert or Update

Sometimes you might want to insert a set of records which includes already existing and new records. When using the `insert` method you would replace the dataset of an already existing record. This can cause unexpected side effects.

For example if an API supports dynamic embedding of relationships and doesn't always return all relationships, the relationships would be emptied when missing on `insert`.

For those cases you can use the `insertOrUpdate` method:

```js
// Initial State.
let state = {
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'John', roles: [3] }
      }
    }
  }
}

// `insertOrUpdate` is going to add new records and update existing
// records (see `update`). Also accepts a single item as data.
User.insertorUpdate({
  data: [
    { id: 1, name: 'Peter' },
    { id: 2, name: 'Hank' }
  ]
})

// State after `insertOrUpdate`. Roles for Peter won't be set to empty array
// The new record is inserted with an empty relationship.
state = {
  entities: {
    users: {
      data: {
        '1': { id: 1, name: 'Peter', roles: [3] },
        '2': { id: 2, name: 'Hank', roles: [] }
      }
    }
  }
}
```

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
