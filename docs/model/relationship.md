# Model: Relationship

## Defining Relationship

The model can define the relationship in `static fields`. Below example shows that the Post has the relationship with Comment of `hasMany`.

```js
import { Model } from '@vuex-orm/core'

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

By defining the relationship, Vuex ORM is going to use those relationships to construct data when storing, modifying and fetching data from Vuex Store.

### One To One

A one-to-one relationship is defined by `this.hasOne` method. For example, User might have one profile information.

```js
import { Model } from '@vuex-orm/core'

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

The first argument of `this.hasOne` is the model itself of the relation. So in this case, we are passing in Profile model. The second argument is the "foreign key" which holds the id of the model. For this example, the foreign key is the `user_id` at Profile model.

### One To One Inverse

To define an inverse relationship of one-to-one, you can do so with `this.belongsTo()` attribute.

```js
import { Model } from '@vuex-orm/core'

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

Now the above Profile model has belongs to relationship to the User model. The arguments are pretty much same with `this.hasOne`. The first argument is the related model, and second is the "foreign key" but of course this time the foreign key exists in the Profile model.

### One To Many

A one-to-many relationship can be defined by `this.hasMany`.

```js
import { Model } from '@vuex-orm/core'

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

For this example, Post has many Comments. The arguments for the `this.hasMany` is again pretty much same as the others. The first argument is the model, and second is the 'foreign key' of the related model.

### Has Many By

In some case, the model itself has all the keys of the related model. Like below example.

```js
{
  nodes: {
    '1': { id: 1 },
    '2': { id: 1 }
  },
  clusters: {
    '1': {
      id: 1,
      nodes: [1, 2]
    }
  }
}
```

As you can see, clusters want to have has many relationship with nodes, but nodes do not have `cluster_id`. You cannot use `this.hasMany` in this case because there is no foreign key to look for. In such case, you may use `this.hasManyBy` relationship.

```js
import { Model } from '@vuex-orm/core'

class Node extends Model {
  static entities = 'nodes'

  static field () {
    return {
      id: this.attr(null),
      name: this.attr(null)
    }
  }
}

class Cluster extends Model {
  static entities = 'clusters'

  static field () {
    return {
      id: this.attr(null),
      nodes: this.hasManyBy(Node, 'nodes')
    }
  }
}
```

Now the cluster model is going to look for nodes using ids at clusters own `nodes` attributes.
