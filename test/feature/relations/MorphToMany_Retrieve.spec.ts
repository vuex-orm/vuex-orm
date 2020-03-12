/* tslint:disable:variable-name */
import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Relations – Morph To Many – Retrieve', () => {
  it('can resolve morph to many relation', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      // @Attribute
      id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      // @Intermediate
      pivot!: Taggable

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
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

    await Post.create({
      data: [{ id: 1 }, { id: 5 }, { id: 6 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Tag.create({
      data: [{ id: 1, name: 'news' }, { id: 2, name: 'cast' }]
    })

    await Taggable.create({
      data: [
        { id: 1, tag_id: 1, taggable_id: 1, taggable_type: 'posts', is_public: true },
        { id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos', is_public: true },
        { id: 3, tag_id: 2, taggable_id: 1, taggable_type: 'posts', is_public: false }
      ]
    })

    const post = Post.query().with('tags').find(1) as Post

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[0].pivot.is_public).toBe(true)
    expect(post.tags[1].name).toBe('cast')
    expect(post.tags[1].pivot.is_public).toBe(false)

    const postWithoutTags = Post.query().with('tags').find(6) as Post

    expect(postWithoutTags.tags.length).toBe(0)
  })

  it('can resolve morph to many relation with custom primary key', async () => {
    class Post extends Model {
      static entity = 'posts'

      static primaryKey = 'post_id'

      // @Attribute
      post_id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          post_id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      // @Attribute
      id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
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

    await Post.create({
      data: [{ post_id: 1 }, { post_id: 5 }]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Tag.create({
      data: [{ id: 1, name: 'news' }, { id: 2, name: 'cast' }]
    })

    await Taggable.create({
      data: [
        { id: 1, tag_id: 1, taggable_id: 1, taggable_type: 'posts' },
        { id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
        { id: 3, tag_id: 2, taggable_id: 1, taggable_type: 'posts' }
      ]
    })

    const post = Post.query().with('tags').find(1) as Post

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom local key', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      post_id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'post_id')
      tags!: Tag[]

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

      // @Attribute
      id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      // @Attribute
      id!: number

      // @Attribute('')
      name!: string

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
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

    await Post.create({
      data: [
        { id: 1, post_id: 10 },
        { id: 5, post_id: 11 }
      ]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Tag.create({
      data: [{ id: 1, name: 'news' }, { id: 2, name: 'cast' }]
    })

    await Taggable.create({
      data: [
        { id: 1, tag_id: 1, taggable_id: 10, taggable_type: 'posts' },
        { id: 2, tag_id: 2, taggable_id: 3, taggable_type: 'videos' },
        { id: 3, tag_id: 2, taggable_id: 10, taggable_type: 'posts' }
      ]
    })

    const post = Post.query().with('tags').find(1) as Post

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom local and related key', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      post_id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type', 'post_id', 'tag_id')
      tags!: Tag[]

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

      // @Attribute
      id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
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

    await Post.create({
      data: [
        { id: 1, post_id: 10 },
        { id: 5, post_id: 11 }
      ]
    })

    await Video.create({
      data: { id: 3 }
    })

    await Tag.create({
      data: [
        { id: 1, tag_id: 100, name: 'news' },
        { id: 2, tag_id: 101, name: 'cast' }
      ]
    })

    await Taggable.create({
      data: [
        { id: 1, tag_id: 100, taggable_id: 10, taggable_type: 'posts' },
        { id: 2, tag_id: 100, taggable_id: 3, taggable_type: 'videos' },
        { id: 3, tag_id: 101, taggable_id: 10, taggable_type: 'posts' }
      ]
    })

    const post = Post.query().with('tags').find(1) as Post

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can apply `orderBy` constraint on nested relations', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Video extends Model {
      static entity = 'videos'

      // @Attribute
      id!: number

      // @MorphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
      tags!: Tag[]

      static fields () {
        return {
          id: this.attr(null),
          tags: this.morphToMany(Tag, Taggable, 'tag_id', 'taggable_id', 'taggable_type')
        }
      }
    }

    class Tag extends Model {
      static entity = 'tags'

      // @Attribute
      id!: number

      static fields () {
        return {
          id: this.attr(null)
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

    await Post.insert({
      data: {
        id: 1,
        tags: [{ id: 1 }, { id: 3 }, { id: 2 }]
      }
    })

    await Video.insert({
      data: {
        id: 1,
        tags: [{ id: 1 }, { id: 3 }, { id: 2 }]
      }
    })

    const post = Post.query()
      .with('tags', query => { query.orderBy('id', 'asc') })
      .find(1) as Post

    expect(post.tags[0].id).toBe(1)
    expect(post.tags[1].id).toBe(2)
    expect(post.tags[2].id).toBe(3)

    const video = Video.query()
      .with('tags', query => { query.orderBy('id', 'desc') })
      .find(1) as Video

    expect(video.tags[0].id).toBe(3)
    expect(video.tags[1].id).toBe(2)
    expect(video.tags[2].id).toBe(1)
  })
})
