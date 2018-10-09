import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Retrieve – Relations – Morph To Many', () => {
  it('can resolve morph to many relation', () => {
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
      posts: {
        '1': { $id: 1, id: 1 },
        '5': { $id: 5, id: 5 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      tags: {
        '1': { $id: 1, id: 1, name: 'news' },
        '2': { $id: 2, id: 2, name: 'cast' }
      },
      taggables: {
        '1': { $id: 1, id: 1, tag_id: 1, taggable_id: 1, taggable_type: 'posts' },
        '2': { $id: 2, id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
        '3': { $id: 3, id: 3, tag_id: 2, taggable_id: 1, taggable_type: 'posts' }
      }
    })

    const post = Query.query(state, 'posts').with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom primary key', () => {
    class Post extends Model {
      static entity = 'posts'

      static primaryKey = 'post_id'

      static fields () {
        return {
          post_id: this.attr(null),
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
      posts: {
        '1': { $id: 1, post_id: 1 },
        '5': { $id: 5, post_id: 5 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      tags: {
        '1': { $id: 1, id: 1, name: 'news' },
        '2': { $id: 2, id: 2, name: 'cast' }
      },
      taggables: {
        '1': { $id: 1, id: 1, tag_id: 1, taggable_id: 1, taggable_type: 'posts' },
        '2': { $id: 2, id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
        '3': { $id: 3, id: 3, tag_id: 2, taggable_id: 1, taggable_type: 'posts' }
      }
    })

    const post = Query.query(state, 'posts').with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom local key', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'post_id')
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
      posts: {
        '1': { $id: 1, id: 1, post_id: 10 },
        '5': { $id: 5, id: 5, post_id: 11 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      tags: {
        '1': { $id: 1, id: 1, name: 'news' },
        '2': { $id: 2, id: 2, name: 'cast' }
      },
      taggables: {
        '1': { $id: 1, id: 1, tag_id: 1, taggable_id: 10, taggable_type: 'posts' },
        '2': { $id: 2, id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
        '3': { $id: 3, id: 3, tag_id: 2, taggable_id: 10, taggable_type: 'posts' }
      }
    })

    const post = Query.query(state, 'posts').with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom local and related key', () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'post_id', 'tag_id')
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
          tag_id: this.attr(null),
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
      posts: {
        '1': { $id: 1, id: 1, post_id: 10 },
        '5': { $id: 5, id: 5, post_id: 11 }
      },
      videos: {
        '3': { $id: 3, id: 3 },
      },
      tags: {
        '1': { $id: 1, id: 1, tag_id: 100, name: 'news' },
        '2': { $id: 2, id: 2, tag_id: 101, name: 'cast' }
      },
      taggables: {
        '1': { $id: 1, id: 1, tag_id: 100, taggable_id: 10, taggable_type: 'posts' },
        '2': { $id: 2, id: 2, tag_id: 100, taggable_id: 3, taggable_type: 'videos' },
        '3': { $id: 3, id: 3, tag_id: 101, taggable_id: 10, taggable_type: 'posts' }
      }
    })

    const post = Query.query(state, 'posts').with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })
})
