# Defining Model

Models are the definition of the data schema that will be handled by Vuex ORM. Every Model should extend `vuex-orm/lib/Model`.

```js
import Model from 'vuex-orm/lib/Model'

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

There are 2 required properties when you define a model.

`static entity` will be used as state name of Vuex Store. So in this case, state for the model User will be accessible by `store.state.entities.users`. Notice there is `entities` state. This state is created by Vuex ORM automatically and all of the Model data will be stored under this namespace.

Overall state structure will look like this.

```js
{
  entities: {
    users: {
      // ...
    }
  }
}
```

Next, `static fields()` should return the schema of the data. For above example, User model has `id` and `name` fields. The model uses `this.attr()`. This is the most generic type of the field and the argument is the default value that will be used when instantiating the model class.

## Relationship

The model can define the relationship in `static fields()` as well. Below example shows the Post has the relationship with Comment of `hasMany`.

```js
import Model from 'vuex-orm/lib/Model'

class Comment extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      post_id: this.attr(null),
      body: this.attr('')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      title: this.attr(''),
      body: this.attr(''),
      comments: this.hasMany(Comment, 'post_id')
    }
  }
}
```

As you can see, Post has `this.hasMany` relation with Comment.

### Relationship Types

Following relationships are available.

`this.attr(<default value>)` – The generic value type. No relationship.

`this.hasOne(Model, foreignKey)` – The Has One relationship.

`this.belongsTo(Model, foreignKey)` – The Belongs To relationship.

`this.hasMany(Model, foreignKey)` – The Has Many relationship.
