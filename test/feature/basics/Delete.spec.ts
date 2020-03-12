import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Basics – Delete', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: number

    // @Str('')
    name!: string

    static fields () {
      return {
        id: this.attr(null),
        name: this.string('')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    // @Num
    id!: number

    static fields () {
      return {
        id: this.number(null)
      }
    }
  }

  const getStore = () => createStore([{ model: User }, { model: Post }])

  it('can delete a record by specifying the id', async () => {
    const store = getStore()

    await User.create([{ id: 1 }, { id: 2 }])

    await User.delete(1)

    const expected = createState({
      users: {
        2: { $id: '2', id: 2, name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete a record by specifying id as a string', async () => {
    const store = getStore()

    await User.create([{ id: 'string_id_1' }, { id: 'string_id_2' }])

    await User.delete('string_id_2')

    const expected = createState({
      users: {
        string_id_1: { $id: 'string_id_1', id: 'string_id_1', name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete records by specifying a closure', async () => {
    const store = getStore()

    await User.create([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Jane Doe' }
    ])

    await User.delete(user => user.name === 'Jane Doe')

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('does nothing if the specified id does not exist', async () => {
    const store = getStore()

    await User.create([{ id: 1 }, { id: 2 }])

    await User.delete(3)

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: '' },
        2: { $id: '2', id: 2, name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns deleted item', async () => {
    const store = getStore()

    await User.create([{ id: 1 }, { id: 2 }])

    const user = await User.delete(1)

    expect(user).toBeInstanceOf(User)
    expect(user?.id).toBe(1)

    const expected = createState({
      users: {
        2: { $id: '2', id: 2, name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns all deleted records as a collection when specifying a closure', async () => {
    const store = getStore()

    await User.create([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Jane Doe' }
    ])

    const users = await User.delete(user => user.name === 'Jane Doe')

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].id).toBe(2)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[1].id).toBe(3)

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('deletes itself by instance method', async () => {
    const store = getStore()

    await User.create([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ])

    const user = User.find(2) as User

    await user.$delete()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete all records in the entity', async () => {
    const store = getStore()

    await User.create([{ id: 1 }, { id: 2 }])

    await User.deleteAll()

    const expected = createState({
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete all records in the entity by the instance method', async () => {
    const store = getStore()

    await User.create([{ id: 1 }, { id: 2 }])

    await (new User()).$deleteAll()

    const expected = createState({
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete all records in the entire entities', async () => {
    const store = getStore()

    await User.create([{ id: 1 }, { id: 2 }])

    await Post.create([{ id: 3 }, { id: 4 }])

    await store.dispatch('entities/deleteAll')

    const expected = createState({
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })
})
