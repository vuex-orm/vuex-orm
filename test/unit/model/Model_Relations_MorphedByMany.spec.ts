import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Model – Relations – Morphed By Many', () => {
  class Post extends Model {
    static entity = 'posts'

    // @Attribute
    id!: number

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  class Video extends Model {
    static entity = 'videos'

    // @Attribute
    id!: number

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  class Tag extends Model {
    static entity = 'tags'

    // @Attribute
    id!: number

    // @Attribute('')
    name!: string

    // @MorphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    posts!: Post[]

    // @MorphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
    videos!: Video[]

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

  it('can resolve morphed by many relation', () => {
    createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    const tag = new Tag({
      id: 1,
      name: 'news',
      posts: [{ id: 1 }, { id: 2 }],
      videos: [{ id: 3 }]
    })

    expect(tag).toBeInstanceOf(Tag)
    expect(tag.id).toBe(1)
    expect(tag.posts.length).toBe(2)
    expect(tag.posts[0]).toBeInstanceOf(Post)
    expect(tag.videos.length).toBe(1)
    expect(tag.videos[0]).toBeInstanceOf(Video)
  })

  it('can resolve empty morphed by many relation', () => {
    const tag = new Tag({ id: 1 })

    expect(tag).toBeInstanceOf(Tag)
    expect(tag.id).toBe(1)
    expect(tag.posts).toEqual([])
    expect(tag.videos).toEqual([])
  })
})
