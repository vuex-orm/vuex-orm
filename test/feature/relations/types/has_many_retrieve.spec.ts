import {
  createStore,
  fillState,
  assertInstanceOf,
  assertModel
} from 'test/Helpers'
import { Model, Attr, Str, HasMany } from '@/index'

describe('feature/relations/types/has_many_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
    posts!: Post[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') title!: string
  }

  it('can eager load has many relation', async () => {
    const store = createStore([User, Post])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' }
      }
    })

    const user = store.$repo(User).with('posts').first()!

    expect(user).toBeInstanceOf(User)
    assertInstanceOf(user.posts, Post)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, title: 'Title 01' },
        { id: 2, userId: 1, title: 'Title 02' }
      ]
    })
  })

  it('can eager load missing relation as empty array', async () => {
    const store = createStore([User, Post])

    fillState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {}
    })

    const user = store.$repo(User).with('posts').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      posts: []
    })
  })
})
