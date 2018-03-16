# Vuex ORM

Vuex ORM is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping access to the Vuex Store. Heavily inspired by Redux recipe of ["Normalizing State Shape"](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) and ["Updating Normalized Data"](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html).

Vuex ORM lets you create "normalized" data schema within Vuex Store with relationships like any other usual ORM library. It also provides fluent API to get, search and update Store state.

## Table Of Contents

- [Prologue](prologue.md)
    - [Release Notes](https://github.com/vuex-orm/vuex-orm/releases)
    - [What Is Vuex ORM](prologue/what-is-vuex-orm.md)
    - [Installation](prologue/installation.md)
    - [Getting Started](prologue/getting-started.md)
- [Core Components](core-components.md)
    - [Models](components/models.md)
    - [Modules And Store](components/modules-and-store.md)
    - [Database And Registration](components/database-and-registration.md)
- [Interacting With Store](interacting-with-store.md)
    - [Inserting And Updating Data](store/inserting-and-updating-data.md)
    - [Retrieving Data](store/retrieving-data.md)
    - [Deleting Data](store/deleting-data.md)
- [Relationships](relationships.md)
    - [Defining Relationships](relationships/defining-relationships.md)
    - [Inserting Relationships](relationships/inserting-relationships.md)
    - [Retrieving Relationships](relationships/retrieving-relationships.md)
- [Advanced Usage](advanced-usage.md)
    - [Interact With Store From Model](advanced/interact-with-store-from-model.md)
    - [Accessors & Mutators](advanced/accessors-and-mutators.md)
    - [Serialization](advanced/serialization.md)
- [Digging Deeper](digging-deeper.md)
    - [Query Class](digging-deeper/query-class.md)
    - [Plugins](digging-deeper/plugins.md)
- [API Reference](api-reference.md)
    - [Model](api/model.md)

## Questions & Discussions

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtMzMxMTY4MzcwOTYzLTYwZDFjNTgzZDk4MDJlODJmMzk5NmNmZDBiYjIyMTVjMDk1MGRkYTEyYmNkMGM4MjRkNGJmYTBhNTIxYTA5OWI) for any questions and discussions.

## Examples

You can find example application built with Vuex ORM [at here](https://github.com/vuex-orm/vuex-orm-examples).

## Plugins

Vuex ORM can be extended via a plugin to add additional features. Here is the list of available plugins.

- [plugin-search](https://github.com/vuex-orm/plugin-search) – The plugin adds a `search()` method to the vuex-orm query methods to easily filter matched records using fuzzy search logic from the [Fuse.js](http://fusejs.io) library.

## Resources

- [Vue](https://vuejs.org)
- [Vuex](https://vuex.vuejs.org)
