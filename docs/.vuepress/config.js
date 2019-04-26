const sidebars = {
  guide: [{
      title: 'Prologue',
      collapsable: false,
      children: [
        '/guide/prologue/what-is-vuex-orm',
        '/guide/prologue/installation',
        '/guide/prologue/getting-started'
      ]
    },
    {
      title: 'Model',
      collapsable: false,
      children: [
        '/guide/model/defining-models',
        '/guide/model/defining-relationships',
        '/guide/model/database-registration'
      ]
    },
    {
      title: 'Inserting & Updating Data',
      collapsable: false,
      children: [
        '/guide/store/inserting-and-updating-data',
        '/guide/store/retrieving-data',
        '/guide/store/deleting-data'
      ]
    },
    {
      title: 'Retrieving Data',
      collapsable: false,
      children: [
        '/guide/relationships/defining-relationships',
        '/guide/relationships/inserting-relationships',
        '/guide/relationships/retrieving-relationships'
      ]
    },
    {
      title: 'Deleting Data',
      collapsable: false,
      children: [
        '/guide/relationships/defining-relationships',
        '/guide/relationships/inserting-relationships',
        '/guide/relationships/retrieving-relationships'
      ]
    },
    {
      title: 'Inheritance',
      collapsable: false,
      children: [
        '/guide/inheritance/defining-inheritance',
        '/guide/inheritance/discriminator-field',
        '/guide/inheritance/notes-on-cycles'
      ]
    },
    {
      title: 'Advanced Usage',
      collapsable: false,
      children: [
        '/guide/components/modules-and-store',
        '/guide/advanced/interact-with-store-from-model',
        '/guide/advanced/accessors-and-mutators',
        '/guide/advanced/lifecycle-hooks',
        '/guide/advanced/serialization'
      ]
    },
    {
      title: 'Digging Deeper',
      collapsable: false,
      children: [
        '/guide/digging-deeper/plugins'
      ]
    }
  ],

  api: [
    '/api/database',
    '/api/model'
  ]
}

module.exports = {
  title: 'Vuex ORM',
  description: 'The Vuex plugin to enable Object-Relational Mapping access to the Vuex Store.',

  base: '/vuex-orm/',

  themeConfig: {
    repo: 'vuex-orm/vuex-orm',
    docsDir: 'docs',

    nav: [{
        text: 'Guide',
        link: '/guide/prologue/what-is-vuex-orm'
      },
      {
        text: 'API Reference',
        link: '/api/database'
      },
      {
        text: 'Release Notes',
        link: 'https://github.com/vuex-orm/vuex-orm/releases'
      }
    ],

    sidebar: {
      '/guide/': sidebars.guide,
      '/api/': sidebars.api,
      '/': sidebars.guide
    }
  }
}
