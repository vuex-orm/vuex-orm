import { createStore, assertState } from 'test/Helpers'
import { Model, Attr, Str, HasMany } from '@/index'

describe('feature/relations/types/has_many_insert', () => {
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

  it('inserts a record to the store with "has many" relation', async () => {
    const store = createStore([User, Post])

    await store.$repo(User).insert({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, title: 'Title 01' },
        { id: 2, userId: 1, title: 'Title 02' }
      ]
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' }
      }
    })
  })

  it('generates missing foreign key', async () => {
    const store = createStore([User, Post])

    await store.$repo(User).insert({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' }
      ]
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' }
      }
    })
  })

  it('can insert a record with missing relational key', async () => {
    const store = createStore([User, Post])

    await store.$repo(User).insert({
      id: 1,
      name: 'John Doe'
    })

    assertState(store, {
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {}
    })
  })
})
