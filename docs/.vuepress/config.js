module.exports = {
  title: 'Vuex ORM',
  description: 'The Vuex plugin to enable Object-Relational Mapping access to the Vuex Store.',

  base: '/vuex-orm/',

  themeConfig: {
    repo: 'vuex-orm/vuex-orm',
    docsDir: 'docs',

    nav: [
      { text: 'Release Notes', link: 'https://github.com/vuex-orm/vuex-orm/releases' }
    ],

    sidebar: [
      {
        title: 'Prologue',
        collapsable: false,
        children: [
          '/prologue/what-is-vuex-orm',
          '/prologue/installation',
          '/prologue/getting-started'
        ]
      },
      {
        title: 'Core Components',
        collapsable: false,
        children: [
          '/components/models',
          '/components/modules-and-store',
          '/components/database-and-registration'
        ]
      },
      {
        title: 'Interacting With Store',
        collapsable: false,
        children: [
          '/store/inserting-and-updating-data',
          '/store/retrieving-data',
          '/store/deleting-data'
        ]
      },
      {
        title: 'Relationships',
        collapsable: false,
        children: [
          '/relationships/defining-relationships',
          '/relationships/inserting-relationships',
          '/relationships/retrieving-relationships'
        ]
      },
      {
        title: 'Advanced Usage',
        collapsable: false,
        children: [
          '/advanced/interact-with-store-from-model',
          '/advanced/accessors-and-mutators',
          '/advanced/lifecycle-hooks',
          '/advanced/serialization'
        ]
      },
      {
        title: 'Digging Deeper',
        collapsable: false,
        children: [
          '/digging-deeper/query-class',
          '/digging-deeper/plugins'
        ]
      },
      {
        title: 'API Reference',
        collapsable: false,
        children: [
          '/api/model'
        ]
      }
    ]
  }
}
