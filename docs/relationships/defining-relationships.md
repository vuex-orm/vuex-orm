# Relationships: Defining Relationships

Vuex ORM supports several different types of relationships:

- Has One
- Belongs To
- Has Many
- Has Many By
- Has And Belongs To Many

The relationships are defined as attributes in model's `static fields`. The below example shows that the Post has the relationship with Comment of `hasMany`.

```js
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

## One To One

A one-to-one relationship is defined by `this.hasOne` method. For example, User might have one profile information.

```js
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

The first argument of `this.hasOne` is the related model, which is, in this case, are Profile model. The second argument is the "foreign key" which holds the primary key of the User model. For this example, the foreign key is the `user_id` at Profile model.

Additionally, Vuex ORM assumes that the foreign key should have a value matching the id (or the custom `static primaryKey`) field of the parent. In other words, Vuex ORM will look for the value of the user's id column in the user_id column of the Profile record. If you would like the relationship to use a value other than id, you may pass the third argument to the hasOne method specifying your custom key:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      local_id: this.attr(null),
      name: this.attr(''),
      profile: this.hasOne(Profile, 'user_id', 'local_id')
    }
  }
}
```

## One To One Inverse

To define an inverse relationship of one-to-one, you can do so with `this.belongsTo()` attribute.

```js
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
      name: this.attr('')
    }
  }
}
```

Now the above Profile model has belongs to relationship to the User model. The arguments are pretty much same with `this.hasOne`. The first argument is the related model, and second is the "foreign key", but of course this time the foreign key exists in the Profile model.

If your parent model – User in this case – does not use id as its primary key, or you wish to join the child model to a different field, you may pass the third argument to the belongsTo method specifying your parent table's custom key:

```js
class Profile extends Model {
  static entity = 'profiles'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      age: this.attr(''),
      sex: this.attr(''),
      user: this.belongsTo(User, 'user_id', 'other_id')
    }
  }
}
```

## One To Many

A one-to-many relationship can be defined by `this.hasMany`.

```js
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

Then of course, the 3rd argument can override which id to look up on parent model, which is Post in this case.

```
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      local_id: this.attr(null),
      title: this.attr(''),
      body: this.attr(''),
      comments: this.hasMany(Comment, 'post_id', 'local_id')
    }
  }
}
```

## Has Many By

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

As you can see, clusters want to have `hasMany` relationship with nodes, but nodes do not have `cluster_id`. You cannot use `this.hasMany` in this case because there is no foreign key to look for. In such case, you may use `this.hasManyBy` relationship.

```js
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

Now the cluster model is going to look for nodes using ids at clusters own `nodes` attributes. As always, you can pass the third argument to specify which id to look for.

```js
class Cluster extends Model {
  static entities = 'clusters'

  static field () {
    return {
      id: this.attr(null),
      nodes: this.hasManyBy(Node, 'nodes', 'other_key')
    }
  }
}
```

## Many To Many

Many-to-many relations are slightly more complicated than other relationships. An example of such a relationship is a user with many roles, where the roles are also shared by other users. For example, many users may have the role of "Admin". To define this relationship, three models are needed: User, Role, and RoleUser. 
The RoleUser contains the fields to hold id of User and Role model. We'll define `user_id` and `role_id` fields here.

The name of RoleUser model coud be anything but for this example, we'll keep it this way to make it easy to understand.

Many-to-many relationships are defined by defining attribute of the `belongsToMany`. 

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
  static entity = 'roleUser'

  static primaryKey = ['role_id', 'user_id']

  static fields () {
    return {
      role_id: this.attr(null),
      user_id: this.attr(null)
    }
  }
}
```

The argument order of the `belongsToMany` attribute is;

1. The Related model which is in this case Role.
2. Intermidiate pivot model which is RoleUser.
3. Field of the pivot model that holds id value of the parent – User – model.
3. Field of the pivot model that holds id value of the related – Role – model.

You may also define custom local key at 4th and 5th argument.

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
        'role_id',
        'user_local_id',
        'role_local_id'
      )
    }
  }
}
```

### Defining The Inverse Of The Relationship

To define the inverse of a many-to-many relationship, you place another `belongsToMany` attribute on your related model. To continue our user roles example, let's define the users method on the Role model:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null)
    }
  }
}

class Role extends Model {
  static entity = 'roles'

  static fields () {
    return {
      id: this.attr(null),
      users: this.belongsToMany(User, RoleUser, 'role_id', 'user_id')
    }
  }
}

class RoleUser extends Model {
  static entity = 'roleUser'

  static primaryKey = ['role_id', 'user_id']

  static fields () {
    return {
      role_id: this.attr(null),
      user_id: this.attr(null)
    }
  }
}
```

As you can see, the relationship is defined the same as its User counterpart, except referencing the User model and the order of 3rd and 4th argument is inversed.
