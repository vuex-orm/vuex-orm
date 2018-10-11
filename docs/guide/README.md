# Vuex ORM

Vuex ORM is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping access to the Vuex Store. Heavily inspired by Redux recipe of ["Normalizing State Shape"](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) and ["Updating Normalized Data"](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html).

Vuex ORM lets you create a "normalized" data schema within a Vuex Store, with relationships such as "Has One" and "Belongs To Many", like any other usual ORM library. It also provides a fluent API to get, search and update Store state.

## Table Of Contents

- Prologue
  - [What Is Vuex ORM](prologue/what-is-vuex-orm.md)
  - [Installation](prologue/installation.md)
  - [Getting Started](prologue/getting-started.md)
- Core Components
  - [Models](components/models.md)
  - [Modules And Store](components/modules-and-store.md)
  - [Database And Registration](components/database-and-registration.md)
- Interacting With Store
  - [Inserting And Updating Data](store/inserting-and-updating-data.md)
  - [Retrieving Data](store/retrieving-data.md)
  - [Deleting Data](store/deleting-data.md)
- Relationships
  - [Defining Relationships](relationships/defining-relationships.md)
  - [Inserting Relationships](relationships/inserting-relationships.md)
  - [Retrieving Relationships](relationships/retrieving-relationships.md)
- Advanced Usage
  - [Interact With Store From Model](advanced/interact-with-store-from-model.md)
  - [Accessors & Mutators](advanced/accessors-and-mutators.md)
  - [Lifecycle Hooks](advanced/lifecycle-hooks.md)
  - [Serialization](advanced/serialization.md)
- Digging Deeper
  - [Query Class](digging-deeper/query-class.md)
  - [Plugins](digging-deeper/plugins.md)
- API Reference
  - [Model](../api/model.md)

## Questions & Discussions

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtMzMxMTY4MzcwOTYzLTYwZDFjNTgzZDk4MDJlODJmMzk5NmNmZDBiYjIyMTVjMDk1MGRkYTEyYmNkMGM4MjRkNGJmYTBhNTIxYTA5OWI) for any questions and discussions.

While there is the Slack Channel, do not hesitate to open an [issue](https://github.com/vuex-orm/vuex-orm/issues) for any question you might have. We're always more than happy to hear any feedback, and we don't care what kind of form they are.

## Examples

You can find an [example application](https://github.com/vuex-orm/vuex-orm-examples) built with Vuex ORM [here](https://github.com/vuex-orm/vuex-orm-examples).

## Plugins

Vuex ORM can be extended via plugins to add additional features. Here is the list of available plugins.

- [Vuex ORM Axios](https://github.com/vuex-orm/plugin-axios) – A plugin to sync the store against a RESTful API.
- [Vuex ORM GraphQL](https://github.com/vuex-orm/vuex-orm-graphql) – A plugin to sync the data against a [GraphQL](https://graphql.org) API.
- [Vuex ORM Search](https://github.com/vuex-orm/plugin-search) – This plugin adds a `search()` method to the vuex-orm query methods to easily filter matched records using fuzzy search logic from the [Fuse.js](http://fusejs.io) library.

## Resources

- [Vue](https://vuejs.org)
- [Vuex](https://vuex.vuejs.org)
