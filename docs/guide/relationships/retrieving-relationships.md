# Retrieving Relationships

You can use the `with` method to load related model when querying data. The argument to the `with` method should be the name of the field that defines the relationship, _not_ the entity name of the related model.

```js
const user = User.query()
  .with('profile')
  .with('posts')
  .find(1)

/*
  User {
    id: 1,
    name: 'john',

    profile: Profile {
      id: 1,
      user_id: 1,
      age: 24
    },

    posts: [
      Post: { id: 1, user_id: 1, body: '...' },
      Post: { id: 2, user_id: 1, body: '...' }
    ]
  }
*/
```

## Load Nested Relation

You can load nested relations with dot syntax.

```js
const user = User.query()
  .with('posts.comments')
  .find(1)

/*
  User {
    id: 1,
    name: 'john',

    posts: [
      Post: {
        id: 1,
        user_id: 1,
        body: '...',

        comments: [
          Comment: { id: 1, post_id: 1, body: '...' },
          Comment: { id: 2, post_id: 1, body: '...' }
        ]
      },

      Post: {
        id: 2,
        user_id: 1,
        body: '...',

        comments: [
          Comment: { id: 3, post_id: 2, body: '...' },
          Comment: { id: 4, post_id: 2, body: '...' }
        ]
      },
    ]
  }
*/
```

You can load multiple sub relations by separating them with `|`;

```js
const user = User.query()
  .with('posts.comments|reviews')
  .find(1)
```

## Load All Relations

You can load all relations using the `withAll` method.

```js
const user = User.query()
  .withAll()
  .find(1)

/*
  User {
    id: 1,
    name: 'john',

    profile: Profile {
      id: 1,
      user_id: 1,
      age: 24
    },

    posts: [
      Post: {
        id: 1,
        user_id: 1,
        body: '...',

        comments: null
      },

      Post: {
        id: 2,
        user_id: 1,
        body: '...',

        comments: null
      },
    ]
  }
*/
```

To fetch all sub relations of a relation using the dot syntax, use `*`;

```js
const user = User.query()
  .with('posts.*') // Fetches all relations of all posts.
  .find(1)
```

To fetch all sub relations to a certain level you can use the `withAllRecursive` method. You can specify a depth to which relations should be loaded. The depth defaults to 3, so if you call `withAllRecursive` with no arguments, it will fetch all sub relations of sub relations of sub relations of the queried entity.

```js
const user = User.query()
  .withAllRecursive()
  .find(1)

/*
  User {
    id: 1,
    name: 'john',

    profile: Profile {
      id: 1,
      user_id: 1,
      age: 24
    },

    posts: [
      Post: {
        id: 1,
        user_id: 1,
        body: '...',

        comments: [
          Comment: { id: 1, post_id: 1, body: '...' },
          Comment: { id: 2, post_id: 1, body: '...' }
        ]
      },

      Post: {
        id: 2,
        user_id: 1,
        body: '...',

        comments: [
          Comment: { id: 3, post_id: 2, body: '...' },
          Comment: { id: 4, post_id: 2, body: '...' }
        ]
      },
    ]
  }
*/
```

## Relation Constraints

To filter the result of relation loaded by the `with` method, you can pass a closure to the second argument to define additional constraints to the query.

```js
// Get all users with posts that have `published` field value of `true`.
const user = User.query().with('posts', (query) => {
  query.where('published', true)
}).get()

/*
  [
    User {
      id: 1,
      name: 'john',
      posts: [
        Post: { id: 1, user_id: 1, body: '...', published: true },
        Post: { id: 2, user_id: 1, body: '...', published: true }
      ]
    },

    ...
  ]
*/
```

When you add constraints to the "nested" relation, the constraints will be applied to the deepest relationship.

```js
const user = User.query().with('posts.comments', (query) => {
  // This constraint will be applied to the `comments`, not `posts`.
  query.where('type', 'review')
}).get()
```

If you need to add constraints to each relation, you could always nest constraints. This is the most flexible way of defining constraints to the relationships.

```js
const user = User.query().with('posts.comments', (query) => {
  query.with('comments', (query) => {
    query.where('type', 'review')
  }).where('published', true)
}).get()
```

## Querying Relationship Existence

When querying the record, you may wish to limit your results based on the existence of a relationship. For example, imagine you want to retrieve all blog posts that have at least one comment. To do so, you may pass the name of the relationship to the `has` methods.

```js
// Retrieve all posts that have at least one comment.
Post.query().has('comments').get()
```

You may also specify count as well.

```js
// Retrieve all posts that have at least 2 comments.
Post.query().has('comments', 2).get()
```

Also, you may add an operator to customize your query even more. The supported operators are `=`, `>`, `>=`, `<` and `<=`.

```js
// Retrieve all posts that have more than 2 comments.
Post.query().has('comments', '>', 2).get()

// Retrieve all posts that have less than or exactly 2 comments.
Post.query().has('comments', '<=', 2).get()
```

If you need even more power, you may use the `whereHas` method to put "where" conditions on your `has` queries. This method allows you to add customized constraints to a relationship constraint, such as checking the content of a comment.

```js
// Retrieve all posts that have comment from user_id 1.
Post.query().whereHas('comments', (query) => {
  query.where('user_id', 1)
}).get()
```

## Querying Relationship Absence

To retrieve records depending on the absence of the relationship, use the `hasNot` and `whereHasNot` methods. These methods will work the same as `has` and `whereHas` but with the opposite result.

```js
// Retrieve all posts that doesn't have comments.
Post.query().hasNot('comments').get()

// Retrieve all posts that doesn't have comment with user_id of 1.
Post.query().whereHasNot('comments', (query) => {
  query.where('user_id', 1)
}).get()
```
