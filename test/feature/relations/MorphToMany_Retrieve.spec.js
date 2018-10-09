import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Morph To Many – Retrieve', () => {
  it('can resolve morph to many relation', async () => {
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

    await Post.create({
      data: [{ id: 1 }, { id: 5 }]
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

    const post = Post.query().with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom primary key', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

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

    const post = Post.query().with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom local key', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

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

    const post = Post.query().with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })

  it('can resolve morph to many relation with custom local and related key', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

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

    const post = Post.query().with('tags').find(1)

    expect(post.tags.length).toBe(2)
    expect(post.tags[0].name).toBe('news')
    expect(post.tags[1].name).toBe('cast')
  })
})
