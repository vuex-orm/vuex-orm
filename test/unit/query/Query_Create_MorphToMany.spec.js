import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Create – Morph To Many', () => {
  it('can create a morph to many relation data', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    class Taggable extends Model {
      static entity = 'taggables'

      static fields () {
        return {
          id: this.increment(),
          tag_id: this.attr(null),
          taggable_id: this.attr(null),
          taggable_type: this.attr(null)
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    const state = createState({
      posts: {},
      videos: {},
      tags: {},
      taggables: {}
    })

    const data = {
      id: 1,
      tags: [
        { id: 2, name: 'news' },
        { id: 3, name: 'cast' }
      ]
    }

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, tags: [] }
      },
      videos: {},
      tags: {
        '2': { $id: 2, id: 2, name: 'news' },
        '3': { $id: 3, id: 3, name: 'cast' }
      },
      taggables: {
        '1': { $id: 1, id: 1, tag_id: 2, taggable_id: 1, taggable_type: 'posts' },
        '2': { $id: 2, id: 2, tag_id: 3, taggable_id: 1, taggable_type: 'posts' }
      }
    })

    Query.create(state, 'posts', data)

    expect(state).toEqual(expected)
  })

  it('can create many morph to many relation data', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    class Taggable extends Model {
      static entity = 'taggables'

      static fields () {
        return {
          id: this.attr(null),
          tag_id: this.attr(null),
          taggable_id: this.attr(null),
          taggable_type: this.attr(null)
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    const state = createState({
      posts: {},
      videos: {},
      tags: {},
      taggables: {}
    })

    const data = [
      {
        id: 1,
        tags: [
          { id: 2, name: 'news' },
          { id: 3, name: 'cast' }
        ]
      },
      {
        id: 2,
        tags: [
          { id: 2, name: 'news' },
          { id: 5, name: 'cast' }
        ]
      }
    ]

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1, tags: [] },
        '2': { $id: 2, id: 2, tags: [] }
      },
      videos: {},
      tags: {
        '2': { $id: 2, id: 2, name: 'news' },
        '3': { $id: 3, id: 3, name: 'cast' },
        '5': { $id: 5, id: 5, name: 'cast' }
      },
      taggables: {
        '1_2_posts': { $id: '1_2_posts', id: null, tag_id: 2, taggable_id: 1, taggable_type: 'posts' },
        '1_3_posts': { $id: '1_3_posts', id: null, tag_id: 3, taggable_id: 1, taggable_type: 'posts' },
        '2_2_posts': { $id: '2_2_posts', id: null, tag_id: 2, taggable_id: 2, taggable_type: 'posts' },
        '2_5_posts': { $id: '2_5_posts', id: null, tag_id: 5, taggable_id: 2, taggable_type: 'posts' }
      }
    })

    Query.create(state, 'posts', data)

    expect(state).toEqual(expected)
  })
})
