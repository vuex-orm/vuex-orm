import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Create – Morphed By Many', () => {
  it('can create a morphed by many relation data', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          posts: this.morphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type'),
          videos: this.morphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
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

    const data = {
      id: 1,
      name: 'news',
      posts: [{ id: 1 }, { id: 2 }],
      videos: [{ id: 3 }, { id: 4 }]
    }

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
        '4': { $id: 4, id: 4 }
      },
      tags: {
        '1': { $id: 1, id: 1, name: 'news', posts: [], videos: [] }
      },
      taggables: {
        '1_1_posts': { $id: '1_1_posts', id: null, tag_id: 1, taggable_id: 1, taggable_type: 'posts' },
        '2_1_posts': { $id: '2_1_posts', id: null, tag_id: 1, taggable_id: 2, taggable_type: 'posts' },
        '3_1_videos': { $id: '3_1_videos', id: null, tag_id: 1, taggable_id: 3, taggable_type: 'videos' },
        '4_1_videos': { $id: '4_1_videos', id: null, tag_id: 1, taggable_id: 4, taggable_type: 'videos' }
      }
    })

    Query.create(state, 'tags', data)

    expect(state).toEqual(expected)
  })

  it('can create many morphed by many relation data', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          posts: this.morphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type'),
          videos: this.morphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
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
        name: 'news',
        posts: [{ id: 1 }, { id: 2 }],
        videos: [{ id: 3 }, { id: 4 }]
      },
      {
        id: 2,
        name: 'cast',
        posts: [{ id: 2 }, { id: 3 }],
        videos: [{ id: 3 }, { id: 5 }]
      }
    ]

    const expected = createState({
      posts: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
        '4': { $id: 4, id: 4 },
        '5': { $id: 5, id: 5 }
      },
      tags: {
        '1': { $id: 1, id: 1, name: 'news', posts: [], videos: [] },
        '2': { $id: 2, id: 2, name: 'cast', posts: [], videos: [] }
      },
      taggables: {
        '1_1_posts': { $id: '1_1_posts', id: null, tag_id: 1, taggable_id: 1, taggable_type: 'posts' },
        '2_1_posts': { $id: '2_1_posts', id: null, tag_id: 1, taggable_id: 2, taggable_type: 'posts' },
        '3_1_videos': { $id: '3_1_videos', id: null, tag_id: 1, taggable_id: 3, taggable_type: 'videos' },
        '4_1_videos': { $id: '4_1_videos', id: null, tag_id: 1, taggable_id: 4, taggable_type: 'videos' },
        '2_2_posts': { $id: '2_2_posts', id: null, tag_id: 2, taggable_id: 2, taggable_type: 'posts' },
        '3_2_posts': { $id: '3_2_posts', id: null, tag_id: 2, taggable_id: 3, taggable_type: 'posts' },
        '3_2_videos': { $id: '3_2_videos', id: null, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
        '5_2_videos': { $id: '5_2_videos', id: null, tag_id: 2, taggable_id: 5, taggable_type: 'videos' }
      }
    })

    Query.create(state, 'tags', data)

    expect(state).toEqual(expected)
  })
})
