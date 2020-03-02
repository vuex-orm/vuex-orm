# Attributes

## Field Attributes

Field attributes aid in the handling of default values and casting. Generic
types, primitive types and UID types are supported.

Any field types that allow `null` values may be chained with `nullable()` to
prevent casting. For example, a null value on a number attribute will resolve
as `0` which may be an undesired outcome.

```js
{
  active: this.number(1).nullable()
}
```

**See also**: [Defining Models: Field Attributes](/guide/model/defining-models.md#field-attributes)

### `attr`

- **Type**: `(value: any, mutator?: () => any) => Object`

  Create a generic attribute. Any value can be passed as the default value.

  A closure may also be passed:

  ```js
  {
    rand: this.attr(() => Math.random())
  }
  ```

### `string`

- **Type**: `(value: any, mutator?: () => string | null) => Object`

  Create a string attribute. Values will be cast to [String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String).

### `number`

- **Type**: `(value: any, mutator?: () => number | null) => Object`

  Create a number attribute. Values will be cast to [Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number).

### `boolean`

- **Type**: `(value: any, mutator?: () => boolean | null) => Object`

  Create a boolean attribute. Values will be cast to [Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean).

### `uid`

- **Type**: `(value?: () => string | number) => Object`

  Create a Unique ID attribute. When a field of this type is omitted it will
  generate an auto-incremented number with a `$uid` prefix (e.g. `$uid32`).

  A closure may also be passed:

  ```js
  import { v4 as uuidv4 } from 'uuid'

  {
    id: this.uid(() => uuidv4()) // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  }
  ```


## Relation Attributes

### `hasOne`

- **Type**: `(related: Model | string, foreignKey: string, localKey?: string) => Object`

  Create a 1:1 relation where two models may have only one record on
  either side of the relationship connected by a single foreign key.
  For example, a `User` may own a single `Post`.

  This relation may be reversed using the [belongsTo](#belongsto) attribute.

  | Arguments     |                                                                |
  |---------------|----------------------------------------------------------------|
  | `related`*    | The target model e.g. `Post` or `'posts'`.                     |
  | `foreignKey`* | The foreign key on the source model e.g. `user_id`.            |
  | `localKey`    | The custom key on the source model it's foreign key points to. |

- **See also**: [Relationships: One To One](/guide/model/relationships.md#one-to-one)

### `belongsTo`

- **Type**: `(parent: Model | string, foreignKey: string, ownerKey?: string) => Object`

  Create a one-to-one/many inverse relation where a single record
  belongs to one or more source models connected by a single foreign key.
  For example, a single `Profile` may belong to one or more `User` records.

  This relation attribute may be used to create an inverse relation of
  [hasOne](#hasone) and [hasMany](#hasmany).

  | Arguments     |                                                                |
  |---------------|----------------------------------------------------------------|
  | `parent`*     | The source model e.g. `User` or `'users'`.                     |
  | `foreignKey`* | The foreign key on the target model e.g. `user_id`.            |
  | `ownerKey`    | The custom key on the target model it's foreign key points to. |

- **See also**: [Relationships: One To One Inverse](/guide/model/relationships.md#one-to-one-inverse), [One To Many Inverse](/guide/model/relationships.md#one-to-many)

### `hasMany`

- **Type**: `(related: Model | string, foreignKey: string, localKey?: string) => Object`

  Create a one-to-many relation where a single model may own any amount of
  records belonging to another model.
  For example, a `Post` may have an infinite number of `Comment` records.

  | Arguments     |                                                                |
  |---------------|----------------------------------------------------------------|
  | `related`*    | The target model e.g. `Comment` or `'comments'`.               |
  | `foreignKey`* | The foreign key on the source model e.g. `post_id`.            |
  | `localKey`    | The custom key on the source model it's foreign key points to. |

  This relation may be reversed using the [belongsTo](#belongsto) attribute.

- **See also**: [Relationships: One To Many](/guide/model/relationships.md#one-to-many)

### `hasManyBy`

- **Type**: `(parent: Model | string, foreignKey: string, ownerKey?: string) => Object`

  Create a one-to-many relation where a single model may own many records on
  another model by declaring a field on the target model that contains an array
  of foreign keys to the source model.
  For example, a `Cluster` may own any amount of `Node` records who's foreign
  keys are declared as an array on the `Cluster` model.

  | Arguments     |                                                                 |
  |---------------|-----------------------------------------------------------------|
  | `parent`*     | The source model e.g. `Node` or `'nodes'`.                      |
  | `foreignKey`* | The foreign keys on the target model e.g. `node_ids`.           |
  | `ownerKey`    | The custom key on the source model it's foreign keys points to. |

- **See also**: [Relationships: Has Many By](/guide/model/relationships.md#has-many-by)

### `hasManyThrough`

- **Type**: `(related: Model | string, through: Model | string, firstKey: string, secondKey: string, localKey?: string, secondLocalKey?: string) => Object`

  Create a one-to-many intermediate relation where a single model can own any
  amount of records attached to another model through an intermediate relation.
  For example, a `Country` can have many distant `Post` records through a `User`.
  The `User` may belong to a `Country` and the `Post` records belong to a `User`.

  | Arguments        |                                                                      |
  |------------------|----------------------------------------------------------------------|
  | `related`*       | The source model e.g. `Post` or `'posts'`.                           |
  | `through`*       | The intermediate model e.g. `User` or `'users'`                      |
  | `firstKey`*      | The foreign key on the intermediate model e.g. `country_id`.         |
  | `secondKey`*     | The foreign key on the source model e.g. `user_id`                   |
  | `localKey`       | The custom key on the target model it's foreign key points to.       |
  | `secondLocalKey` | The custom key on the intermediate model it's foreign key points to. |

- **See also**: [Relationships: Has Many Through](/guide/model/relationships.md#has-many-through)

### `belongsToMany`

- **Type**: `(related: Model | string, pivot: Model | string, foreignPivotKey: string, relatedPivotKey: string, parentKey?: string, relatedKey?: string) => Object`

  Create a many-to-many relation where two models may own any amount of records
  on either side of the relationship connected by an intermediate model.
  For example, a `User` may own many `Role` records and `Role` may belong to
  many `User` records.

  The intermediate model connects the two models by a foreign key on the source
  and target model.

  | Arguments          |                                                                      |
  |--------------------|----------------------------------------------------------------------|
  | `related`*         | The source model e.g. `Role` or `'roles'`.                           |
  | `pivot`*           | The intermediate model e.g. `RoleUser` or `'roleUser'`               |
  | `foreignPivotKey`* | The foreign key on the target model e.g. `user_id`.                  |
  | `relatedPivotKey`* | The foreign key on the source model e.g. `role_id`                   |
  | `parentKey`        | The custom key on the target model it's foreign key points to.       |
  | `relatedKey`       | The custom key on the intermediate model it's foreign key points to. |

- **See also**: [Relationships: Many To Many](/guide/model/relationships.md#many-to-many)

### `morphOne`

- **Type**: `(related: Model | string, id: string, type: string, localKey?: string) => Object`

  Create a one-to-one polymorphic relation where a single model may own a single
  record on more than one type of model connected by a single target model.
  For example, `User` and `Post` may own a single `Comment` scoped through
  `Commentable`.

  This relation attribute behaves similar to [hasOne](#hasone) but without
  the model type constraint.

  | Arguments  |                                                                           |
  |------------|---------------------------------------------------------------------------|
  | `related`* | The target model e.g. `Comment` or `'comments'`.                          |
  | `id`*      | The attribute to hold the target model foreign key e.g. `commentable_id`. |
  | `type`*    | The attribute to hold the target model entity e.g. `commentable_type`.    |
  | `localKey` | The custom key on the target model it's foreign key points to.            |

- **See also**: [Relationships: One To One (Polymorphic)](/guide/model/relationships.md#one-to-one-polymorphic)

### `morphTo`

- **Type**: `(id: string, type: string) => Object`

  Create a one-to-one or one-to-many polymorphic inverse relation where a
  single record may belong to more than one type of model connected by a single
  target model.
  For example, a `Comment` may belong to `User` and `Post` scoped through
  `Commentable`.

  This relation attribute behaves similar to [belongsTo](#belongsto) but without
  the model type constraint. It may be used to create an inverse relation
  of [morphOne](#morphone) and [morphMany](#morphmany).

  | Arguments |                                                                           |
  |-----------|---------------------------------------------------------------------------|
  | `id`*     | The attribute holding the source model foreign key e.g. `commentable_id`. |
  | `type`*   | The attribute holding the source model entity e.g. `commentable_type`.    |

- **See also**: [Relationships: One To One (Polymorphic)](/guide/model/relationships.md#one-to-one-polymorphic)

### `morphMany`

- **Type**: `(related: Model | string, id: string, type: string, localKey?: string) => Object`

  Create a one-to-many polymorphic relation where models of more than one type
  may own many records on a single model connected by a single target model.
  For example, `Video` and `Post` may own an infinite number of `Comment` records
  scoped through `Commentable`.

  This relation attribute behaves similar to [hasMany](#hasmany) but without
  the model type constraint.

  | Arguments  |                                                                           |
  |------------|---------------------------------------------------------------------------|
  | `related`* | The target model e.g. `Comment` or `'comments'`.                          |
  | `id`*      | The attribute to hold the target model foreign key e.g. `commentable_id`. |
  | `type`*    | The attribute to hold the target model entity e.g. `commentable_type`.    |
  | `localKey` | The custom key on the target model it's foreign key points to.            |

- **See also**: [Relationships: One To Many (Polymorphic)](/guide/model/relationships.md#one-to-many-polymorphic)

### `morphToMany`

- **Type**: `(related: Model | string, pivot: Model | string, relatedId: string, id: string, type: string, parentKey?: string, relatedKey?: string) => Object`

  Create a many-to-many polymorphic relation where more than one type of model
  may own any number of records on the target model connected by an intermediate model.
  For example, an infinite number of `Tag` may belong to any amount of `User`
  and `Post` records scoped through `Taggable`.

  This relation attribute behaves similar to [belongsToMany](#belongstomany)
  but without the model type constraint.

  | Arguments    |                                                                       |
  |--------------|-----------------------------------------------------------------------|
  | `related`*   | The source model e.g. `Tag` or `'tags'`                               |
  | `pivot`*     | The intermediate model e.g. `Taggable`                                |
  | `relatedId`* | The attribute to hold the source model foreign key e.g. `tag_id`      |
  | `id`*        | The attribute to hold the target model foreign key e.g. `taggable_id` |
  | `type`*      | The attribute to hold the target model entity e.g. `taggable_type`    |
  | `parentKey`  | The custom key on the target model it's foreign key points to.        |
  | `relatedKey` | The custom key on the source model it's foreign key points to.        |

- **See also**: [Relationships: Many To Many (Polymorphic)](/guide/model/relationships.md#many-to-many-polymorphic)

### `morphedByMany`

- **Type**: `(related: Model | string, pivot: Model | string, relatedId: string, id: string, type: string, parentKey?: string, relatedKey?: string) => Object`

  Create a many-to-many polymorphic inverse relation where a record on the
  target model belongs to more than one type of source model connected by an
  intermediate model.
  For example, `Tag` may belong to many `Post` and `User` scoped through `Taggable`.

  | Arguments    |                                                                       |
  |--------------|-----------------------------------------------------------------------|
  | `related`*   | The target model e.g. `Post` or `'posts'`                             |
  | `pivot`*     | The intermediate model e.g. `Taggable`                                |
  | `relatedId`* | The attribute to hold the source model foreign key e.g. `tag_id`      |
  | `id`*        | The attribute to hold the target model foreign key e.g. `taggable_id` |
  | `type`*      | The attribute to hold the target model entity e.g. `taggable_type`    |
  | `parentKey`  | The custom key on the source model it's foreign key points to.        |
  | `relatedKey` | The custom key on the target model it's foreign key points to.        |

- **See also**: [Relationships: Many To Many Inverse (Polymorphic)](/guide/model/relationships.md#defining-the-inverse-of-the-relationship-2)
