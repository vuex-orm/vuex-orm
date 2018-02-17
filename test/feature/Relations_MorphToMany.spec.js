import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Morph To Many', () => {
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
            { id: 3, name: 'news' },
            { id: 4, name: 'cast' }
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
