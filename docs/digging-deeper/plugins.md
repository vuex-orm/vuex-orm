# Digging Deeper: Plugins

You may add additional features to the Vuex ORM through plugins. Plugins usually add global-level functionality to Vuex ORM. Vuex ORM plugin works very similar to [Vue Plugin](https://vuex.vuejs.org/en/plugins.html).

## Available Plugins

Here is the list of available plugins.

- [vuex-orm-search](https://github.com/vuex-orm/plugin-search) – The plugin adds a `search()` method to the vuex-orm query methods to easily filter matched records using fuzzy search logic from the [Fuse.js](http://fusejs.io) library.
- [vuex-orm-apollo](https://github.com/vuex-orm/vuex-orm-apollo) – The plugin to sync the data against a [GraphQL](https://graphql.org) API via [Apollo](https://www.apollographql.com).

## Writing a Plugin

A Vuex ORM plugin should be an object that exposes an install method. The method will be called with the Vuex ORM components such as Model, Repo, Query and such as the first argument, along with possible options.

```js
const plugin = {
  // `components` contains Vuex ORM objects such as Model and Query.
  // The plugin author can then extend those objects to add
  // whatever features it needs.
  install (components, options) {
    // Add global (static) method or property.
    components.Model.globalMethod = function () {
      // Logic...
    }

    // Add an instance method or property.
    components.Query.prototype.instanceMethod = function () {
      // Logic...
    }
  }
}
```

### Extendable Components

Following components are included within `components` argument.

- Model
- Query
- Attribute
- Type
- Attr
- Increment
- Relation
- HasOne
- BelongsTo
- HasMany
- HasManyBy
- BelongsToMany
- HasManyThrough
- MorphTo
- MorphOne
- MorphMany
- MorphToMany
- MorphedByMany
- rootGetters
- subGetters
- rootActions
- subActions
- mutations

## Using a Plugin

Use plugins by calling the VuexORM.use() method.

```js
import VuexORM from '@vuex-orm/core'
import plugin from 'vuex-orm-plugin'

VuexORM.use(plugin)
```

You can optionally pass in some options too.

```js
VuexORM.use(plugin, { someOption: true })
```
