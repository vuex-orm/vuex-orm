# Installation

You can install Vuex ORM via NPM, Yarn, or download directly. Remember since Vuex ORM is a plugin of [Vuex](https://vuex.vuejs.org), you need to install Vuex alongside with Vuex ORM.

## NPM

```console
$ npm install vuex vuex-orm --save
```

## Yarn

```console
$ yarn add vuex vuex-orm
```

## Direct Download / CDN

https://unpkg.com/vuex-orm

[Unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link always points to the latest release on NPM. You can also use a specific version/tag via URLs like `https://unpkg.com/vuex-orm@0.8.0.`
Include Vuex ORM from HTML script.

```html
<script src="https://unpkg.com/vuex-orm"></script>

<!-- For the minified version -->
<script src="https://unpkg.com/dist/vuex-orm.min.js"></script>
```

## Dev Build

You have to clone directly from GitHub and build vuex yourself if you want to use the latest dev build.

```console
$ git clone https://github.com/revolver-app/vuex-orm.git node_modules/vuex-orm
$ cd node_modules/vuex-orm
$ npm install
$ npm run build
```
