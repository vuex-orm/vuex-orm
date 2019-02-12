# Vuex ORM

Vuex ORM is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping access to the Vuex Store. Vuex ORM lets you create "normalized" data schema within Vuex Store with relationships such as "Has One" and "Belongs To Many" like any other usual ORM library. It also provides fluent API to get, search and update Store state.

Vuex ORM is heavily inspired by Redux recipe of ["Normalizing State Shape"](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) and ["Updating Normalized Data"](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html). Learn more about the concept and motivation of Vuex ORM at [What Is Vuex ORM?](https://vuex-orm.github.io/vuex-orm/guide/prologue/what-is-vuex-orm.html).

## Table Of Contents

- Prologue
    - [What Is Vuex ORM?](guide/prologue/what-is-vuex-orm.md)
    - [Installation](guide/prologue/installation.md)
    - [Getting Started](guide/prologue/getting-started.md)
- Core Components
    - [Models](guide/components/models.md)
    - [Modules and Store](guide/components/modules-and-store.md)
    - [Database and Registration](guide/components/database-and-registration.md)
- Interacting With Store
    - [Inserting and Updating Data](guide/store/inserting-and-updating-data.md)
    - [Retrieving Data](guide/store/retrieving-data.md)
    - [Deleting Data](guide/store/deleting-data.md)
- Relationships
    - [Defining Relationships](guide/relationships/defining-relationships.md)
    - [Inserting Relationships](guide/relationships/inserting-relationships.md)
    - [Retrieving Relationships](guide/relationships/retrieving-relationships.md)
- Advanced Usage
    - [Interact With Store From Model](guide/advanced/interact-with-store-from-model.md)
    - [Accessors & Mutators](guide/advanced/accessors-and-mutators.md)
    - [Lifecycle Hooks](guide/advanced/lifecycle-hooks.md)
    - [Serialization](guide/advanced/serialization.md)
- Digging Deeper
    - [Plugins](guide/digging-deeper/plugins.md)
- API Reference
    - [Database](api/database.md)
    - [Model](api/model.md)

## Questions & Discussions

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtNDQ0NjE3NTgyOTY2LTI0YjE5YmNmMDIxNWZlNmJhM2EyMDg1MDRkODA4YmQwMDU5OWRkZmNhN2RmOTZkZGZkODQxZTRkYjhmYmJiNTY) for any questions and discussions.

Although there is the Slack Channel, do not hesitate to open an [issue](https://github.com/vuex-orm/vuex-orm/issues) for any question you might have. We're always more than happy to hear any feedback, and we don't care what kind of form they are.

## Examples

You can find example application built with Vuex ORM [at here](https://github.com/vuex-orm/vuex-orm-examples).

## Plugins

Vuex ORM can be extended via a plugin to add additional features. Here is the list of available plugins.

- [Vuex ORM Axios](https://github.com/vuex-orm/plugin-axios) – The plugin to sync the store against a RESTful API.
- [Vuex ORM GraphQL](https://github.com/vuex-orm/plugin-graphql) – The plugin to sync the store against a [GraphQL](https://graphql.org) API.
- [Vuex ORM Search](https://github.com/vuex-orm/plugin-search) – The plugin adds a search() method to filter records using fuzzy search logic from the [Fuse.js](http://fusejs.io).
- [Vuex ORM Change Flags](https://github.com/vuex-orm/plugin-change-flags) - Vuex ORM plugin for adding IsDirty / IsNew flags to model entities.

## Resources

- [Vue](https://vuejs.org)
- [Vuex](https://vuex.vuejs.org)

You may find a list of awesome things related to Vuex ORM at [Awesome Vuex ORM](https://github.com/vuex-orm/awesome-vuex-orm).
