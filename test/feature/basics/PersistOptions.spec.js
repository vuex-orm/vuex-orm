import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Feature – Basics – Create', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
        posts: this.hasMany(Post, 'posts')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        id: this.attr(null),
        title: this.attr('')
      }
    }
  }

  it('can `create` related records', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await User.create({
      data: { id: 1 }
    })

    await Post.create({
      data: { id: 1 }
    })

    await User.insert({
      data: {
        id: 2,
        posts: [{ id: 2 }, { id: 3 }]
      },
      create: ['posts']
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['1']).toBe(undefined)
    expect(store.state.entities.posts.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['3'].id).toBe(3)
  })

  it('can `insert` related records', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await User.create({
      data: { id: 1 }
    })

    await Post.create({
      data: { id: 1 }
    })

    await User.create({
      data: {
        id: 2,
        posts: [{ id: 2 }, { id: 3 }]
      },
      insert: ['posts']
    })

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['3'].id).toBe(3)
  })

  it('can `update` related records', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await User.create({
      data: { id: 1 }
    })

    await Post.create({
      data: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' }
      ]
    })

    await User.create({
      data: {
        id: 2,
        posts: [
          { id: 1, title: 'Title 01-Edit' },
          { id: 2, title: 'Title 02-Edit' }
        ]
      },
      update: ['posts']
    })

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['1'].title).toBe('Title 01-Edit')
    expect(store.state.entities.posts.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['2'].title).toBe('Title 02-Edit')
  })

  it('can `insertOrUpdate` related records', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await User.create({
      data: { id: 1 }
    })

    await Post.create({
      data: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' }
      ]
    })

    await User.create({
      data: {
        id: 2,
        posts: [
          { id: 2, title: 'Title 02-Edit' },
          { id: 3, title: 'Title 03' }
        ]
      },
      insertOrUpdate: ['posts']
    })

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['1'].title).toBe('Title 01')
    expect(store.state.entities.posts.data['2'].id).toBe(2)
    expect(store.state.entities.posts.data['2'].title).toBe('Title 02-Edit')
    expect(store.state.entities.posts.data['3'].id).toBe(3)
    expect(store.state.entities.posts.data['3'].title).toBe('Title 03')
  })
})
