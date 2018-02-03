# Relationships: Retrieving Relationships

You can use `with` method to load related model when querying data. The argument to the `with` method should be the name of the field that defines the relationship, not the entity name of the related model.

```js
const user = store.getters['entities/users/query']()
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

You can load nested relation with dot syntax.

```js
const user = store.getters['entities/users/query']()
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

## Relation Constraint

To filter the result of relation loaded with `with` method, you can do so by passing a closure to the second argument.

```js
const user = store.getters['entities/users/query']().with('posts', (query) => {
  query.where('published', true)
}).find(1)

/*
  User {
    id: 1,
    name: 'john',

    posts: [
      Post: { id: 1, user_id: 1, body: '...', published: true },
      Post: { id: 2, user_id: 1, body: '...', published: true }
    ]
  }
*/
```

When you want to add a constraint to the nested relation, use a closure instead of the dot syntax.

```js
const user = store.getters['entities/users/query']().with('posts', (query) => {
  query.with('comments', (query) => {
    query.where('type', 'review')
  }).where('published', true)
}).find(1)

/*
  User {
    id: 1,
    name: 'john',

    posts: [
      Post: {
        id: 1,
        user_id: 1,
        body: '...',
        published: true,

        comments: [
          Comment: { id: 1, post_id: 1, body: '...', type: 'review' },
          Comment: { id: 2, post_id: 1, body: '...', type: 'review' }
        ]
      },

      Post: {
        id: 2,
        user_id: 1,
        body: '...',
        published: true,

        comments: [
          Comment: { id: 3, post_id: 2, body: '...', type: 'review' },
          Comment: { id: 4, post_id: 2, body: '...', type: 'review' }
        ]
      },
    ]
  }
*/
```

## Querying Relationship Existence

When querying the record, you may wish to limit your results based on the existence of a relationship. For example, imagine you want to retrieve all blog posts that have at least one comment. To do so, you may pass the name of the relationship to the has methods.

```js
// Retrieve all posts that have at least one comment.
store.getters['entities/posts/query']().has('comments').get()
```

You may also specify count as well.

```js
// Retrieve all posts that have at least 2 comments.
store.getters['entities/posts/query']().has('comments', 2).get()
```

Also, you may add an operator to customize your query even more. The supported operators are `>`, `>=`, `<` and `<=`.

```js
// Retrieve all posts that have more than 2 comments.
store.getters['entities/posts/query']().has('comments', '>' 2).get()

// Retrieve all posts that have less than or exactly 3 comments.
store.getters['entities/posts/query']().has('comments', '<=' 2).get()
```

And even more, you can pass closure for a complex query. If closure may return boolean, or it can just add constraints to the query.

```js
// Retrieve all posts that have user_id of 1.
store.getters['entities/posts/query']().has('comments', (query) => {
  query.where('user_id', 1)
}).get()

// Retrieve all posts that have more than 2 comments with user_id of 1.
store.getters['entities/posts/query']().has('comments', (query) => {
  return query.where('user_id', 1).count() > 2
}).get()
```

## Querying Relationship Absence

To retrieve records depending on absence of the relationship, use `hasNot` method. `hasNot` method will work same as `has` but in opposite result.

```js
// Retrieve all posts that doesn't have comments.
store.getters['entities/posts/query']().hasNot('comments').get()

// Retrieve all posts that doesn't have comment with user_id of 1.
store.getters['entities/posts/query']().hasNot('comments', (query) => {
  query.where('user_id', 1)
}).get()
```
