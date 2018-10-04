# Plugins

You may add additional features to the Vuex ORM through plugins. Plugins usually add global-level functionality to Vuex ORM. Vuex ORM plugin works very similar to [Vue Plugin](https://vuex.vuejs.org/en/plugins.html).

## Available Plugins

Here is the list of available plugins.

- [Vuex ORM Axios](https://github.com/vuex-orm/plugin-axios) – The plugin to sync the store against a RESTful API.
- [Vuex ORM GraphQL](https://github.com/vuex-orm/plugin-graphql) – The plugin to sync the data against a [GraphQL](https://graphql.org) API.
- [Vuex ORM Search](https://github.com/vuex-orm/plugin-search) – The plugin adds a search() method to filter records using fuzzy search logic from the [Fuse.js](http://fusejs.io).

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
- String
- Number
- Boolean
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
- RootGetters
- Getters
- RootActions
- Actions
- RootMutations

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
