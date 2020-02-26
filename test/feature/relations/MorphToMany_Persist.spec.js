import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Morph To Many – Persist', () => {
  it('can create a morph to many relation data', async () => {
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
          tag_id: this.attr(null),
          taggable_id: this.attr(null),
          taggable_type: this.attr(null),
          public: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await Post.create({
      data: {
        id: 1,
        tags: [
          { id: 2, name: 'news', pivot: { public: true } },
          { id: 3, name: 'cast' }
        ]
      }
    })

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.tags.data['2'].id).toBe(2)
    expect(store.state.entities.tags.data['3'].id).toBe(3)
    expect(store.state.entities.taggables.data['1_2_posts'].taggable_id).toBe(1)
    expect(store.state.entities.taggables.data['1_2_posts'].taggable_type).toBe('posts')
    expect(store.state.entities.taggables.data['1_2_posts'].public).toBe(true)
    expect(store.state.entities.taggables.data['1_3_posts'].taggable_id).toBe(1)
    expect(store.state.entities.taggables.data['1_3_posts'].taggable_type).toBe('posts')
    expect(store.state.entities.taggables.data['1_3_posts'].public).toBe(null)
  })

  it('can create a morph to many data without relation field', async () => {
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
      static entity = 'tag'

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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await store.dispatch('entities/posts/create', {
      data: { id: 1 }
    })

    const expected = {
      1: { $id: '1', id: 1, tags: [] }
    }

    expect(store.state.entities.posts.data).toEqual(expected)
  })

  it('can create a morph to many relation data with uid as id set on pivot model', async () => {
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
          tag_id: this.attr(null),
          taggable_id: this.attr(null),
          taggable_type: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await Post.create({
      data: {
        id: 1,
        tags: [
          { id: 2, name: 'news' },
          { id: 3, name: 'cast' }
        ]
      }
    })

    const expected = createState({
      posts: {
        1: { $id: '1', id: 1, tags: [] }
      },
      videos: {},
      tags: {
        2: { $id: '2', id: 2, name: 'news' },
        3: { $id: '3', id: 3, name: 'cast' }
      },
      taggables: {
        '1_2_posts': { $id: '1_2_posts', tag_id: 2, taggable_id: 1, taggable_type: 'posts' },
        '1_3_posts': { $id: '1_3_posts', tag_id: 3, taggable_id: 1, taggable_type: 'posts' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create a morph to many relation data with uid as id set on parent model', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.uid(),
          title: this.attr(''),
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await Post.create({
      data: {
        title: 'Post title.',
        tags: [
          { id: 2, name: 'news' },
          { id: 3, name: 'cast' }
        ]
      }
    })

    const expected = createState({
      posts: {
        $uid1: { $id: '$uid1', id: '$uid1', title: 'Post title.', tags: [] }
      },
      videos: {},
      tags: {
        2: { $id: '2', id: 2, name: 'news' },
        3: { $id: '3', id: 3, name: 'cast' }
      },
      taggables: {
        $uid1_2_posts: { $id: '$uid1_2_posts', id: null, tag_id: 2, taggable_id: '$uid1', taggable_type: 'posts' },
        $uid1_3_posts: { $id: '$uid1_3_posts', id: null, tag_id: 3, taggable_id: '$uid1', taggable_type: 'posts' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create a morph to many relation data with pivot data having custom key', async () => {
    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'id', 'id', 'tag_pivot')
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
          tag_id: this.attr(null),
          taggable_id: this.attr(null),
          taggable_type: this.attr(null),
          public: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await Post.create({
      data: {
        id: 1,
        tags: [
          { id: 2, name: 'news', tag_pivot: { public: true } },
          { id: 3, name: 'cast' }
        ]
      }
    })

    expect(store.state.entities.taggables.data['1_2_posts'].public).toBe(true)
    expect(store.state.entities.taggables.data['1_3_posts'].public).toBe(null)
  })

  it('can resolve a morph to many relation', async () => {
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
      static entity = 'tag'

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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await store.dispatch('entities/posts/create', {
      data: [
        {
          id: 1,
          tags: [
            { id: 1, name: 'news' },
            { id: 2, name: 'cast' }
          ]
        },
        {
          id: 2,
          tags: [
            { id: 1, name: 'news' },
            { id: 2, name: 'cast' }
          ]
        }
      ]
    })

    const post = store.getters['entities/posts/query']().with('tags').find(1)

    expect(post).toBeInstanceOf(Post)
    expect(post.tags.length).toBe(2)
    expect(post.tags[0]).toBeInstanceOf(Tag)
    expect(post.tags[1]).toBeInstanceOf(Tag)
  })
})
