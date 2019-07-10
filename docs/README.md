# Vuex ORM

Vuex ORM is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping access to the Vuex Store. Vuex ORM lets you create "normalized" data schema within Vuex Store with relationships such as "Has One" and "Belongs To Many" like any other usual ORM library. It also provides fluent API to get, search and update Store state.

Vuex ORM is heavily inspired by Redux recipe of ["Normalizing State Shape"](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) and ["Updating Normalized Data"](http://redux.js.org/docs/recipes/reducers/UpdatingNormalizedData.html). Learn more about the concept and motivation of Vuex ORM at [What is Vuex ORM?](https://vuex-orm.github.io/vuex-orm/guide/prologue/what-is-vuex-orm.html).

## Table Of Contents

- Prologue
    - [What is Vuex ORM?](guide/prologue/what-is-vuex-orm.md)
    - [Installation](guide/prologue/installation.md)
    - [Getting Started](guide/prologue/getting-started.md)
- Model
    - [Defining Models](/guide/model/defining-models.md)
    - [Relationships](/guide/model/relationships.md)
    - [Single Table Inheritance](/guide/model/single-table-inheritance.md)
    - [Accessors & Mutators](/guide/model/accessors-and-mutators.md)
    - [Database Registration](/guide/model/database-registration.md)
- Data
    - [Inserting & Updating](/guide/data/inserting-and-updating.md)
    - [Retrieving](/guide/data/retrieving.md)
    - [Deleting](/guide/data/deleting.md)
- Digging Deeper
    - [Vuex Module](/guide/digging-deeper/vuex-module.md)
    - [Lifecycle Hooks](/guide/digging-deeper/lifecycle-hooks.md)
    - [Serialization](/guide/digging-deeper/serialization.md)
    - [Plugins](/guide/digging-deeper/plugins.md)
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
- [Vuex ORM Soft Delete](https://github.com/vuex-orm/plugin-soft-delete) – Vuex ORM plugin for adding soft delete feature to model entities.

## Resources

- [Vue](https://vuejs.org)
- [Vuex](https://vuex.vuejs.org)

You may find a list of awesome things related to Vuex ORM at [Awesome Vuex ORM](https://github.com/vuex-orm/awesome-vuex-orm).
