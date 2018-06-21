import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Model – Relations – Morph To Many', () => {
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

  it('can resolve morph to many relation', () => {
    createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    const data = {
      id: 1,
      tags: [
        { id: 1, name: 'news' },
        { id: 2, name: 'cast' }
      ]
    }

    const post = new Post(data)

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.tags[0]).toBeInstanceOf(Tag)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1]).toBeInstanceOf(Tag)
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve empty morph to many relation', () => {
    const post = new Post({ id: 1 })

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.tags).toEqual([])
  })
})
