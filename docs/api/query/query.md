# Query

Query instances may be obtained by calling the [query](/api/model/model.md#query) method from a model.

**See also**: [Query Builder](/guide/data/retrieving.md#query-builder)

## Filters

### `where`

- **Type**:

  - `(field: string, value: any) => Query`
  - `(field: string, value: (model) => boolean) => Query`
  - `(field: (model, query) => void) => Query`

  Add a "where" condition. Subsequent "where" conditions are combined with the `and` operator.

  ```js
  // Field equality
  User.query().where('age', '20')

  // Field equality by expression
  User.query().where('age', (user) => user.age > 20)

  // Expression
  User.query().where((user) => user.age > 20 && user.sex === 'female')

  // Constraint groups
  User.query().where('role', 'user').where((model, query) => {
    query.where('age', '20').orWhere('sex', 'female')
  })
  ```

  Closures will receive two arguments - a model instance and a query instance. The query instance allows for adding constraint groups such as, but not limited to, parameter grouping. This type of closure does not require a return value. However, expressions must return a boolean.

  ::: warning NOTE
  Expression closures require a boolean return type. In such cases returning truthy/falsy, such as `array.length`, `null` or `undefined`, will result in unexpected side-effects ([#402](https://github.com/vuex-orm/vuex-orm/issues/402)). This is a design limitation since constraint closures don't expect a return type.
  :::

- **See also**: [Where Clauses](/guide/data/retrieving.md#where-clauses)

### `orWhere`

- **Type**:

  - `(field: string, value: any) => Query`
  - `(field: string, value: (model) => boolean) => Query`
  - `(field: (model, query) => void) => Query`

  Extend [where()](#where) condition with the `or` operator.

### `whereId`

- **Type**: `(value: number | string) => Query`

  Filter records by primary key.

### `whereIdIn`

- **Type**: `(values: Array<string | number>) => Query`

  Filter records by an array of primary keys.

### `offset`

- **Type**: `(offset: number) => Query`

  Add an offset expression to skip a certain number of records before beginning to return the result.

### `limit`

- **Type**: `(limit: number) => Query`

  Add a limit expression to constrain the number of records to be returned.

### `orderBy`

- **Type**: `(field: string | (model) => any, direction: string = 'asc') => Query`

- **Directions**: `'asc'` | `'desc'`

  Sort the result set by field. The default sort direction is `asc`.

  A closure may be passed as the first argument which is applied on each result iteration. The closure may return a value to apply as the sorting value.

  ```js
  // Sort user name by its 3rd character
  User.query().orderBy(user => user.name[2])
  ```

- **See also**: [Order By](/guide/data/retrieving.md#order-by)


## Relations

By default, Vuex ORM does not query relations unless explicitly told to with the following methods.

**See also**: [Retrieving Relationships](/guide/data/retrieving.md#relationships)

### `with`

- **Type**: `(name: string | Array<string>, constraint: (query) => void | null = null) => Query`

  Eager load relations by attribute name.

  Using dot notation, it is possible to load child relations.

  ```js
  Users.query().with('posts.comments')
  ```

  In addition, using a dot notation wildcard makes it possible to load all child relations of a relation.

  ```js
  Users.query().with('posts.*')
  ```

  Constraints may be added by passing a closure as the second argument. The closure will receive a query instance as a single argument.

  ```js
  User.query().with('posts', (query) => {
    query.where('published', true)
  })
  ```

### `withAll`

- **Type**: `() => Query`

  Eager load all relations defined on the model.

### `withAllRecursive`

- **Type**: `(depth: number = 3) => Query`

  Eager load all relations recursively. By default the recursion `depth` is 3 levels.

### `has`

- **Type**: `(relation: string, operator?: string | number, count?: number) => Query`

  Add a conditional constraint based on relation existence.

  Where `count` is supplied as the second argument, relations will be constrained to a number of records it holds.

  Additionally, an operator can be added as the second argument in addition to the `count` as the third argument for a more concise comparison. Supported operators are: `'>'`, `'>='`, `'='`, `'<='`, `'<'`.

  ```js
  // Filter posts having at least 2 comments
  Post.query().has('comments', 2)

  // Filter posts having more than 2 comments
  Post.query().has('comments', '>', 2)
  ```

### `hasNot`

- **Type**: `(relation: string, operator?: string | number, count?: number) => Query`

  Add a conditional constraint based on relation absence. See [has()](#has) for detail on usage.

### `whereHas`

- **Type**: `(relation: string, constraint: (query) => void) => Query`

  Add a conditional "where" constraint based on relation existence.

  ```js
  Post.query().whereHas('comments', (query) => {
    query.where('user_id', 1)
  })
  ```

### `whereHasNot`

- **Type**: `(relation: string, constraint: (query) => void) => Query`

  Add a conditional "where" constraint based on relation absence. See [whereHas()](#wherehas) for detail on usage.


## Results

### `get`

- **Type**: `() => Array`

  Execute the query chain and return the result.

### `first`

- **Type**: `() => Object | null`

  Execute the query chain and return the first record from the result set.

### `last`

- **Type**: `() => Object | null`

  Execute the query chain and return the last record from the result set.

### `count`

- **Type**: `() => number`

  Execute the query chain and return the total number of records in the result set.

### `min`

- **Type**: `(field: string) => number`

  Execute the query chain and return the [min](https://en.wikipedia.org/wiki/Maxima_and_minima) value of field.

### `max`

- **Type**: `(field: string) => number`

  Execute the query chain and return the [max](https://en.wikipedia.org/wiki/Maxima_and_minima) value of field.

### `sum`

- **Type**: `(field: string) => number`

  Execute the query chain and eturn the [sum](https://en.wikipedia.org/wiki/Summation)
  value of field.

## Lifecycle Hooks

Registering global lifecycle hooks grants interaction with particular points in a query lifecycle on a global scale. Liefecycle hooks can also be [registered on models](../model/lifecycle-hooks.md). The number of arguments passed to a callback also depends on the type of hook being registered.

**See also**: [Lifecycle Hooks](/guide/digging-deeper/lifecycle-hooks)

### `on`

- **Type**: `(on: string, callback: (model) => boolean | void) => number`

  ```js
  Query.on('beforeCreate', (record) => [...])
  ```

  Certain [lifecycle hooks](/guide/digging-deeper/lifecycle-hooks) allow a boolean to be returned to permit or prevent state mutations.

### `off`

- **Type**: `(id: number) => boolean`

  ```js
  const hookId = Query.on('beforeCreate', (record) => [...])

  Query.off(hookId)
  ```
