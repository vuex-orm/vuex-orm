/* tslint:disable:variable-name */
import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Relations – Morphed By Many – Retrieve', () => {
  it('can resolve morphed by many relation', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Intermediate
      pivot!: Taggable

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

      // @Intermediate
      pivot!: Taggable

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

      // @Attribute
      id!: number

      // @Attribute
      tag_id!: number

      // @Attribute
      taggable_id!: number

      // @Attribute
      taggable_type!: string

      // @Attribute
      is_public!: boolean

      static fields () {
        return {
          id: this.attr(null),
          tag_id: this.attr(null),
          taggable_id: this.attr(null),
          taggable_type: this.attr(null),
          is_public: this.attr(null)
        }
      }
    }

    createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await Post.create([{ id: 1 }, { id: 5 }])

    await Video.create([{ id: 3 }, { id: 4 }, { id: 5 }])

    await Tag.create([{ id: 1, name: 'news' }, { id: 3, name: 'without references' }])

    await Taggable.create([
      { id: 1, tag_id: 1, taggable_id: 1, taggable_type: 'posts', is_public: false },
      { id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos', is_public: true },
      { id: 3, tag_id: 1, taggable_id: 5, taggable_type: 'posts', is_public: true },
      { id: 4, tag_id: 1, taggable_id: 4, taggable_type: 'videos', is_public: false }
    ])

    const tag = Tag.query().with('posts').with('videos').find(1) as Tag

    expect(tag.posts.length).toBe(2)
    expect(tag.posts[0].pivot.is_public).toBe(false)
    expect(tag.posts[1].pivot.is_public).toBe(true)
    expect(tag.videos.length).toBe(1)
    expect(tag.videos[0].pivot.is_public).toBe(false)

    const tagWithoutReferences = Tag.query().with('posts').with('videos').find(3) as Tag

    expect(tagWithoutReferences.videos.length).toBe(0)
    expect(tagWithoutReferences.posts.length).toBe(0)
  })

  it('can resolve morphed by many relation with custom primary key', async () => {
    class Post extends Model {
      static entity = 'posts'

      static primaryKey = 'post_id'

      // @Attribute
      post_id!: number

      static fields () {
        return {
          post_id: this.attr(null)
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

      static primaryKey = 'tag_id'

      // @Attribute
      tag_id!: number

      // @Attribute('')
      name!: string

      // @MorphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      posts!: Post[]

      // @MorphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      videos!: Video[]

      static fields () {
        return {
          tag_id: this.attr(null),
          name: this.attr(''),
          posts: this.morphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type'),
          videos: this.morphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Taggable extends Model {
      static entity = 'taggables'

      // @Attribute
      id!: number

      // @Attribute
      tag_id!: number

      // @Attribute
      taggable_id!: number

      // @Attribute
      taggable_type!: string

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

    await Post.create([{ post_id: 1 }, { post_id: 5 }])

    await Video.create([{ id: 3 }, { id: 4 }, { id: 5 }])

    await Tag.create({ tag_id: 1, name: 'news' })

    await Taggable.create([
      { id: 1, tag_id: 1, taggable_id: 1, taggable_type: 'posts' },
      { id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
      { id: 3, tag_id: 1, taggable_id: 5, taggable_type: 'posts' },
      { id: 4, tag_id: 1, taggable_id: 4, taggable_type: 'videos' }
    ])

    const tag = Tag.query().with('posts').with('videos').find(1) as Tag

    expect(tag.posts.length).toBe(2)
    expect(tag.videos.length).toBe(1)
  })

  it('can resolve morphed by many relation with custom local and related key', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      post_id!: number

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
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

      // @Attribute
      tag_id!: number

      // @Attribute('')
      name!: string

      // @MorphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'tag_id', 'post_id')
      posts!: Post[]

      // @MorphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'tag_id')
      videos!: Video[]

      static fields () {
        return {
          id: this.attr(null),
          tag_id: this.attr(null),
          name: this.attr(''),
          posts: this.morphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'tag_id', 'post_id'),
          videos: this.morphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'tag_id')
        }
      }
    }

    class Taggable extends Model {
      static entity = 'taggables'

      // @Attribute
      id!: number

      // @Attribute
      tag_id!: number

      // @Attribute
      taggable_id!: number

      // @Attribute
      taggable_type!: string

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

    await Post.create([
      { id: 1, post_id: 100 },
      { id: 5, post_id: 105 }
    ])

    await Video.create([{ id: 3 }, { id: 4 }, { id: 5 }])

    await Tag.create({ id: 1, tag_id: 200, name: 'news' })

    await Taggable.create([
      { id: 1, tag_id: 200, taggable_id: 100, taggable_type: 'posts' },
      { id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
      { id: 3, tag_id: 200, taggable_id: 105, taggable_type: 'posts' },
      { id: 4, tag_id: 200, taggable_id: 4, taggable_type: 'videos' }
    ])

    const tag = Tag.query().with('posts').with('videos').find(1) as Tag

    expect(tag.posts.length).toBe(2)
    expect(tag.videos.length).toBe(1)
  })

  it('can apply `orderBy` constraint on nested relations', async () => {
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

      // @MorphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      posts!: Post[]

      // @MorphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      videos!: Video[]

      static fields () {
        return {
          id: this.attr(null),
          posts: this.morphedByMany(Post, Taggable, 'tag_id', 'taggable_id', 'taggable_type'),
          videos: this.morphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Taggable extends Model {
      static entity = 'taggables'

      // @Attribute
      id!: number

      // @Attribute
      tag_id!: number

      // @Attribute
      taggable_id!: number

      // @Attribute
      taggable_type!: string

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

    await Tag.create({
      id: 1,
      posts: [{ id: 1 }, { id: 3 }, { id: 2 }],
      videos: [{ id: 1 }, { id: 3 }, { id: 2 }]
    })

    const tag = Tag.query()
      .with('posts', query => { query.orderBy('id', 'asc') })
      .with('videos', query => { query.orderBy('id', 'desc') })
      .find(1) as Tag

    expect(tag.posts[0].id).toBe(1)
    expect(tag.posts[1].id).toBe(2)
    expect(tag.posts[2].id).toBe(3)

    expect(tag.videos[0].id).toBe(3)
    expect(tag.videos[1].id).toBe(2)
    expect(tag.videos[2].id).toBe(1)
  })
})
