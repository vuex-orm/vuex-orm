import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Morphed By Many – Persist', () => {
  it('can create a morphed by many relation data', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await Tag.create({
      data: {
        id: 1,
        name: 'news',
        posts: [{ id: 1 }, { id: 2 }],
        videos: [{ id: 3 }, { id: 4 }]
      }
    })

    const data = {
      id: 1,
      name: 'news',
      posts: [{ id: 1 }, { id: 2 }],
      videos: [{ id: 3 }, { id: 4 }]
    }

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['2'].id).toBe(2)
    expect(store.state.entities.videos.data['3'].id).toBe(3)
    expect(store.state.entities.videos.data['4'].id).toBe(4)
    expect(store.state.entities.tags.data['1'].id).toBe(1)
    expect(store.state.entities.taggables.data['1_1_posts'].taggable_id).toBe(1)
    expect(store.state.entities.taggables.data['1_1_posts'].taggable_type).toBe('posts')
    expect(store.state.entities.taggables.data['2_1_posts'].taggable_id).toBe(2)
    expect(store.state.entities.taggables.data['2_1_posts'].taggable_type).toBe('posts')
    expect(store.state.entities.taggables.data['3_1_videos'].taggable_id).toBe(3)
    expect(store.state.entities.taggables.data['3_1_videos'].taggable_type).toBe('videos')
    expect(store.state.entities.taggables.data['4_1_videos'].taggable_id).toBe(4)
    expect(store.state.entities.taggables.data['4_1_videos'].taggable_type).toBe('videos')
  })

  it('can create many morphed by many relation data', async () => {
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

    const store = createStore([{ model: Post }, { model: Video }, { model: Tag }, { model: Taggable }])

    await Tag.create({
      data: [
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

    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['3'].id).toBe(3)

    expect(store.state.entities.videos.data['3'].id).toBe(3)
    expect(store.state.entities.videos.data['4'].id).toBe(4)
    expect(store.state.entities.videos.data['5'].id).toBe(5)

    expect(store.state.entities.tags.data['1'].id).toBe(1)
    expect(store.state.entities.tags.data['2'].id).toBe(2)

    expect(store.state.entities.taggables.data['1_1_posts'].taggable_id).toBe(1)
    expect(store.state.entities.taggables.data['1_1_posts'].taggable_type).toBe('posts')

    expect(store.state.entities.taggables.data['2_1_posts'].taggable_id).toBe(2)
    expect(store.state.entities.taggables.data['2_1_posts'].taggable_type).toBe('posts')

    expect(store.state.entities.taggables.data['3_1_videos'].taggable_id).toBe(3)
    expect(store.state.entities.taggables.data['3_1_videos'].taggable_type).toBe('videos')

    expect(store.state.entities.taggables.data['4_1_videos'].taggable_id).toBe(4)
    expect(store.state.entities.taggables.data['4_1_videos'].taggable_type).toBe('videos')

    expect(store.state.entities.taggables.data['2_2_posts'].taggable_id).toBe(2)
    expect(store.state.entities.taggables.data['2_2_posts'].taggable_type).toBe('posts')

    expect(store.state.entities.taggables.data['3_2_posts'].taggable_id).toBe(3)
    expect(store.state.entities.taggables.data['3_2_posts'].taggable_type).toBe('posts')

    expect(store.state.entities.taggables.data['3_2_videos'].taggable_id).toBe(3)
    expect(store.state.entities.taggables.data['3_2_videos'].taggable_type).toBe('videos')

    expect(store.state.entities.taggables.data['5_2_videos'].taggable_id).toBe(5)
    expect(store.state.entities.taggables.data['5_2_videos'].taggable_type).toBe('videos')
  })
})
