# Defining Relationships

Relationship management is the key strength of Vuex ORM. The relationships may defined as attributes in Model's `static fields`. The below example shows that the Post has the relationship with Comment of `hasMany`.

```js
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
```

By defining relationships, Vuex ORM is going to use those relationships to construct data when storing, modifying, and fetching data from the Vuex Store. Vuex ORM supports several different types of relationships:

- [One To One](#one-to-one)
- [One To Many](#one-to-many)
- [Many To Many](#many-to-many)
- [Has Many By](#has-many-by)
- [Has Many Through](#has-many-through)
- [Polymorphic Relations](#polymorphic-relations)
- [Many To Many Polymorphic Relations](#many-to-many-polymorphic-relations)

## One To One

A one-to-one relationship is defined by `this.hasOne` method. For example, User might have one profile information.

```js
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
```

The first argument of `this.hasOne()` is the related model, which in this case is the Profile model. The second argument is the "foreign key" which holds the primary key of the User model. In this example, the foreign key is the `user_id` of the Profile model.

Additionally, Vuex ORM assumes that the foreign key should have a value matching the id (or the custom `static primaryKey`) field of the parent. In other words, Vuex ORM will look for the value of the User's id column in the user_id column of the Profile record. If you would like the relationship to use a value other than id, you may pass the third argument to the hasOne method specifying your custom key:

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

To define an inverse relationship of one-to-one, you can do so with the `this.belongsTo()` attribute.

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
```

Now the above Profile model has a belongs to relationship to the User model. The arguments are pretty much the same with `this.hasOne()`. The first argument is the related model, and second is the "foreign key", but of course this time the foreign key exists in the Profile model.

If your parent model – User in this case – does not use id as its primary key, or you wish to join the child model to a different field, you may pass the third argument to the `belongsTo` method specifying your parent table's custom key:

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      other_id: this.attr(null),
      name: this.attr('')
    }
  }
}

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

A one-to-many relationship can be defined by `this.hasMany()`. For example, a blog post may have an infinite number of comments.

```js
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
```

The arguments for the `this.hasMany()` is again pretty much the same as the others. The first argument is the related model, and second is the 'foreign key' of the related model.

Then of course, the 3rd argument can override which id to look up on parent model, which is Post in this case.

```js
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

Has Many By is similar to Has Many relations, but having foreign keys at parent Model as an array. For example, there could be a situation where you must parse data looks something like:

```js
{
  nodes: {
    1: { id: 1 },
    2: { id: 1 }
  },
  clusters: {
    1: {
      id: 1,
      node_ids: [1, 2]
    }
  }
}
```

As you can see, `clusters` have `hasMany` relationship with `nodes`, but `nodes` do not have `cluster_id`. You can't use `this.hasMany()` in this case because there is no foreign key to look for. In such cases, you may use `this.hasManyBy()` relationship.

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
      node_ids: this.attr(null),
      nodes: this.hasManyBy(Node, 'node_ids')
    }
  }
}
```

Now the cluster model is going to look for Nodes using ids at Cluster's own `node_ids` attributes.

As always, you can pass the third argument to specify which id to look for.

```js
class Cluster extends Model {
  static entities = 'clusters'

  static field () {
    return {
      id: this.attr(null),
      node_ids: this.attr(null),
      nodes: this.hasManyBy(Node, 'node_ids', 'other_key')
    }
  }
}
```

## Many To Many

Many-to-many relations are slightly more complicated than other relationships. An example of such a relationship is a user with many roles, where the roles are also shared by other users. For example, many users may have the role of "Admin". To define this relationship, three models are needed: User, Role, and RoleUser.
The RoleUser contains the fields to hold id of User and Role model. We'll define `user_id` and `role_id` fields here.

The name of RoleUser model could be anything, but for this example, we'll keep it this way to make it easy to understand.

Many-to-many relationships are defined by defining `this.belongsToMany()`.

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

The argument order of the `belongsToMany` attribute is:

1. The Related model which is in this case Role.
2. Intermediate pivot model which is RoleUser.
3. Field of the pivot model that holds the id value of the parent – User – model.
4. Field of the pivot model that holds the id value of the related – Role – model.

You may also define custom local key at 5th and 6th argument.

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

To define the inverse of a many-to-many relationship, you can place another `belongsToMany` attribute on your related model. To continue our user roles example, let's define the users method on the Role model:

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

## Has Many Through

The "has-many-through" relationship provides a convenient shortcut for accessing distant relations via an intermediate relation. For example, a Country might have many Posts through an intermediate User. In this example, you could easily gather all posts for a given country. Let's look at the models required to define this relationship:

```js
class Country extends Model {
  static entity = 'countries'

  static fields () {
    return {
      id: this.attr(null),
      posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      country_id: this.attr(null)
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

Though posts do not contain a country_id column, the `hasManyThrough` relation provides access to a country's posts. To perform this query, Vuex ORM inspects the `country_id` on the intermediate User model. After finding the matching user IDs, they are used to query the Post model.

The first argument passed to the `hasManyThrough` method is the final model we wish to access, while the second argument is the intermediate model. The third argument is the name of the foreign key on the intermediate model. The fourth argument is the name of the foreign key on the final model.

If you would like to customize the local key for the models, you could also pass the 5th argument which is the local key, while the 6th argument is the local key of the intermediate model.

```js
this.hasManyThrough(
  Post,               // Final model we wish to access.
  User,               // Intermediate model.
  'country_id',       // Foreign key on User model.
  'user_id',          // Foreign key on Post model.
  'local_country_id', // Local key on Country model.
  'local_user_id'     // Local key on User model.
)
```

> **NOTE:** When creating data that contains `hasManyThrough` relationship without intermediate relation, the intermediate record will not be generated. [See here](inserting-relationships#creating-has-many-through-relationship) for more details.

## Polymorphic Relations

A polymorphic relationship allows the target Model to belong to more than one type of Model using a single association.

### One To One Polymorphic Relation

A one-to-one polymorphic relation is similar to a simple one-to-one relation; however, the target model can belong to more than one type of model on a single association. For example, a blog Post and a User may share a polymorphic relation to an Image model. Using a one-to-one polymorphic relation allows you to have a single list of unique images that are used for both blog posts and user accounts.

To build these relationships, you need to declare three models.

```js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string(''),
      image: this.morphOne(Image, 'imageable_id', 'imageable_type')
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      title: this.string(''),
      image: this.morphOne(Image, 'imageable_id', 'imageable_type')
    }
  }
}

class Image extends Model {
  static entity = 'images'

  static fields () {
    return {
      id: this.attr(null),
      url: this.attr(''),
      imageable_id: this.attr(null),
      imageable_type: this.attr(null)
    }
  }
}
```

Take note of the `imageable_id` and `imageable_type` columns on the images table. The `imageable_id` column will contain the ID value of the post or user, while the `imageable_type` column will contain the class name of the parent Model. The `imageable_type` column is used by Eloquent to determine which "type" of parent model to return when accessing the imageable relation.

`this.morphMany` method defined at both User and Post model is the definition of the relationship. Now you may fetch image for the model as usual.

```js
User.query().with('image').find(1)

/*
  {
    id: 1,
    name: 'John Doe',
    image: {
      id: 1,
      url: '/profile.jpg',
      imageable_id: 1,
      imageable_type: 'posts'
    },
  }
*/
```

You may also retrieve the owner of a polymorphic relation from the polymorphic model by defining the `morphTo` attribute.

```js
class Image extends Model {
  static entity = 'images'

  static fields () {
    return {
      id: this.attr(null),
      url: this.attr(''),
      imageable_id: this.attr(null),
      imageable_type: this.attr(null),
      imageable: this.morphTo('imageable_id', 'imageable_type')
    }
  }
}
```

Then you can query the relationship via `with` query chain as same as other relationships.

```js
Image.query().with('imageable').get()

/*
  [
    {
      id: 1,
      url: '/profile.jpg',
      imageable_id: 1,
      imageable_type: 'posts',
      imageable: {
        id: 1,
        name: 'John Doe'
      }
    },
    {
      id: 2,
      url: '/profile.jpg',
      imageable_id: 1,
      imageable_type: 'videos'
      imageable: {
        id: 1,
        title: 'Hello, world!'
      }
    }
  ]
*/
```

### One To Many Polymorphic Relation

A one-to-many polymorphic relation is similar to a simple one-to-many relation; however, the target model can belong to more than one type of model on a single association. For example, imagine users of your application can "comment" on both posts and videos. Using polymorphic relationships, you may use a single comments table for both of these scenarios. First, let's examine the table structure required to build this relationship:

To build these relationships, you need to declare three models.

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      post_title: this.string(''),
      comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
    }
  }
}

class Video extends Model {
  static entity = 'videos'

  static fields () {
    return {
      id: this.attr(null),
      video_link: this.string(''),
      comments: this.morphMany(Comment, 'commentable_id', 'commentable_type')
    }
  }
}

class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      body: this.attr(''),
      commentable_id: this.attr(null),
      commentable_type: this.attr(null)
    }
  }
}
```

Two important fields to note are the `commentable_id` and `commentable_type` on the Comment model. The `commentable_id` field will contain the ID value of the Post or Video, while the `commentable_type` field will contain the entity name of the owning model. The `commentable_type` field is how the Vuex ORM determines which "type" of owning model to return when accessing the commentable relation.

`this.morphMany` method defined at both Post and Video model is the definition of the relationship. Now you may fetch comments for the model as usual.

```js
Post.query().with('comments').find(1)

/*
  {
    id: 1,
    post_title: 'Hello, world!',
    comments: [
      { id: 1, body: 'comment 1', commentable_id: 1, commentable_type: 'posts' },
      { id: 2, body: 'comment 2', commentable_id: 1, commentable_type: 'posts' }
    ]
  }
*/
```

You may also retrieve the owner of a polymorphic relation from the polymorphic model by defining the `morphTo` attribute.

```js
class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      body: this.attr(''),
      commentable_id: this.attr(null),
      commentable_type: this.attr(null),
      commentable: this.morphTo('commentable_id', 'commentable_type')
    }
  }
}
```

Then you can query the relationship via `with` query chain as same as other relationships.

```js
Comment.query().with('commentable').get()

/*
  [
    {
      id: 1,
      body: 'comment 1',
      commentable_id: 1,
      commentable_type: 'posts',
      commentable: {
        id: 1,
        post_title: 'Hello, world!'
      }
    },
    {
      id: 2,
      body: 'comment 2',
      commentable_id: 1,
      commentable_type: 'videos'
      commentable: {
        id: 1,
        video_link: 'https://example.com'
      }
    }
  ]
*/
```

## Many To Many Polymorphic Relations

In addition to traditional polymorphic relations, you may also define "many-to-many" polymorphic relations. For example, a blog Post and Video model could share a polymorphic relation to a Tag model. Using a many-to-many polymorphic relation allows you to have a single list of unique tags that are shared across blog posts and videos.

You can define many-to-many polymorphic relations by using the `this.morphToMany` attribute.

```js
class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    }
  }
}

class Video extends Model {
  static entity = 'videos'

  static fields () {
    return {
      id: this.attr(null),
      tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    }
  }
}

class Tag extends Model {
  static entity = 'tags'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}

class Taggable extends Model {
  static entity = 'taggables'

  static fields () {
    return {
      id: this.attr(null),
      tag_id: this.attr(null),
      taggable_id: this.attr(null),
      taggable_type: this.attr(null)
    }
  }
}
```

### Defining The Inverse Of The Relationship

To define the inverse relation to fetch related record – for this example it's for Tag model – you can use the `this.morphedByMany()` attribute.

```js
class Tag extends Model {
  static entity = 'tags'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      posts: this.morphedByMany(
        Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type'
      ),
      videos: this.morphedByMany(
        Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type'
      )
    }
  }
}
```
