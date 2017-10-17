# Model: Relationship

## Defining Relationship

The model can define the relationship in `static fields()`. Below example shows that the Post has the relationship with Comment of `hasMany`.

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

By defining relationship, Vuex ORM will use those relationship to construct data when storing, modifing and fetching data from Vuex Store.

### One To One

A one-to-one relationship is defined by `this.hasOne()` method. For example, User might have one profile information.

```js
import Model from 'vuex-orm/lib/Model'

class Profile extends Model {
  static entity = 'profiles'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      age: this.attr(''),
      sex: this.attr('')
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      profile: this.hasOne(Profile, 'user_id')
    }
  }
}
```

The first argument of `this.hasOne()` is the model it self of the relation. So in this case, we're passing in Profile model. The second argument is the "foreign key" which holds the id of the model. For this exmaple, the foreign key will be the `user_id` in Profile model.

### One To One Inverse

To define a inverse relationship of one-to-one, you can do so with `this.belongsTo()` attribute.

```js
import Model from 'vuex-orm/lib/Model'

class Profile extends Model {
  static entity = 'profiles'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      age: this.attr(''),
      sex: this.attr(''),
      user: this.belongsTo(User, 'user_id')
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      profile: this.hasOne(Profile, 'user_id')
    }
  }
}
```

Now the above Profile model has belongs to relationship to the User model. The arguments are pretty much same with `this.hasOne()`. First argument is the related model, and second is the "foreign key" but of course this time the foreign key exists in the Profile model.

### One To Many

A one-to-many relationship can be defined by `this.hasMany()`.

```js
import Model from 'vuex-orm/lib/Model'

class Comment extends Model {
  static entity = 'comments'

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

For this example, Post has many Comments. The arguments for the `this.hasMany()` is again pretty much same as the others. The first argument is the model, and second is the 'foreign key' of the related model.
