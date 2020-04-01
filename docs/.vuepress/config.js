const sidebars = {
  guide: [
    {
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
        '/guide/model/relationships',
        '/guide/model/single-table-inheritance',
        '/guide/model/accessors-and-mutators',
        '/guide/model/database-registration',
        '/guide/model/retrieving-models'
      ]
    },
    {
      title: 'Data',
      collapsable: false,
      children: [
        '/guide/data/inserting-and-updating',
        '/guide/data/retrieving',
        '/guide/data/deleting'
      ]
    },
    {
      title: 'Digging Deeper',
      collapsable: false,
      children: [
        '/guide/digging-deeper/vuex-module',
        '/guide/digging-deeper/lifecycle-hooks',
        '/guide/digging-deeper/serialization',
        '/guide/digging-deeper/server-side-rendering',
        '/guide/digging-deeper/plugins'
      ]
    },
    {
      title: 'Sponsors',
      collapsable: false,
      children: [
        '/guide/sponsors/awesome-folks'
      ]
    }
  ],

  api: [
    {
      title: 'Container',
      collapsable: false,
      children: [
        '/api/container/container'
      ]
    },
    {
      title: 'Database',
      collapsable: false,
      children: [
        '/api/database/database'
      ]
    },
    {
      title: 'Model',
      collapsable: false,
      children: [
        '/api/model/model',
        '/api/model/attributes',
        '/api/model/lifecycle-hooks'
      ]
    },
    {
      title: 'Query',
      collapsable: false,
      children: [
        '/api/query/query'
      ]
    }
  ]
}

module.exports = {
  title: 'Vuex ORM',
  description: 'The Vuex plugin to enable Object-Relational Mapping (ORM) access to the Vuex Store.',

  base: '/vuex-orm/',

  themeConfig: {
    repo: 'vuex-orm/vuex-orm',
    docsDir: 'docs',
    sidebarDepth: 2,

    nav: [{
        text: 'Guide',
        link: '/guide/prologue/what-is-vuex-orm'
      },
      {
        text: 'API Reference',
        link: '/api/container/container'
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
