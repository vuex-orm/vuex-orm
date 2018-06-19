import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Basics – Delete', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        id: this.attr(null)
      }
    }
  }

  function getStore () {
    return createStore([{ model: User }, { model: Post }])
  }

  it('can delete a record', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/users/delete', 1)

    const expected = createState('entities', {
      users: {
        '2': { $id: 2, id: 2, name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete a record where property', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/users/delete', {
      where: 1
    })

    const expected = createState('entities', {
      users: {
        '2': { $id: 2, id: 2, name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete records by closure', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    await store.dispatch('entities/users/delete', user => user.name === 'Jane Doe')

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete records by specifying closure to the where property', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    await store.dispatch('entities/users/delete', {
      where (user) {
        return user.name === 'Jane Doe'
      }
    })

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete record id by specifying id as string', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/users/delete', '3')

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: '' },
        '2': { $id: 2, id: 2, name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('does nothing if the specified id does not exist', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/users/delete', 3)

    const expected = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: '' },
        '2': { $id: 2, id: 2, name: '' }
      },
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('returns deleted item', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    const user = await store.dispatch('entities/users/delete', 1)

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
  })

  it('returns all deleted records as collection when using closure', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    const users = await store.dispatch('entities/users/delete', user => user.name === 'Jane Doe')

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].id).toBe(2)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[1].id).toBe(3)
  })

  it('can delete all records in the entity', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/users/deleteAll')

    const expected = createState('entities', {
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can delete all records in the entire entities', async () => {
    const store = getStore()

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/posts/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/deleteAll')

    const expected = createState('entities', {
      users: {},
      posts: {}
    })

    expect(store.state.entities).toEqual(expected)
  })
})
