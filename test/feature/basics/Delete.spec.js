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

  it('can delete a record by specifying the id', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    await User.delete(1)

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2'].id).toBe(2)
  })

  it('can delete a record by specifying id as a string', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    await User.delete('2')

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2']).toBe(undefined)
  })

  it('can delete a record by specifying the id at `where` option', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    await User.delete({ where: 1 })

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2'].id).toBe(2)
  })

  it('can delete records by specifying a closure', async () => {
    const store = getStore()

    await User.create({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    await User.delete(user => user.name === 'Jane Doe')

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2']).toBe(undefined)
    expect(store.state.entities.users.data['3']).toBe(undefined)
  })

  it('can delete records by specifying closure to the `where` option', async () => {
    const store = getStore()

    await User.create({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    await User.delete({
      where (user) {
        return user.name === 'Jane Doe'
      }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2']).toBe(undefined)
    expect(store.state.entities.users.data['3']).toBe(undefined)
  })

  it('does nothing if the specified id does not exist', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    await User.delete(3)

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2'].id).toBe(2)
  })

  it('returns deleted item', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    const user = await User.delete(1)

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
    expect(store.state.entities.users.data['1']).toBe(undefined)
  })

  it('returns all deleted records as a collection when specifying a closure', async () => {
    const store = getStore()

    await User.create({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    const users = await User.delete(user => user.name === 'Jane Doe')

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].id).toBe(2)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[1].id).toBe(3)
    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2']).toBe(undefined)
    expect(store.state.entities.users.data['3']).toBe(undefined)
  })

  it('deletes itself if a condition is not specified when calling as an instance method', async () => {
    const store = getStore()

    await User.create({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const user = User.find(2)

    user.$delete()

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2']).toBe(undefined)
  })

  it('does nothing if trying to delete itself when $id value is not yet assigned', async () => {
    const store = getStore()

    await User.create({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const user = new User()

    user.$delete()

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2'].id).toBe(2)
  })

  it('deletes a record specified by the condition when calling as an instance method', async () => {
    const store = getStore()

    await User.create({
      data: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    })

    const user = User.find(1)

    user.$delete(2)

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2']).toBe(undefined)
  })

  it('can delete all records in the entity', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    await User.deleteAll()

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2']).toBe(undefined)
  })

  it('can delete all records in the entity by the instance method', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    await (new User()).$deleteAll()

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2']).toBe(undefined)
  })

  it('can delete all records in the entire entities', async () => {
    const store = getStore()

    await User.create({
      data: [{ id: 1 }, { id: 2 }]
    })

    await Post.create({
      data: [{ id: 3 }, { id: 4 }]
    })

    await store.dispatch('entities/deleteAll')

    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2']).toBe(undefined)
    expect(store.state.entities.users.data['1']).toBe(undefined)
    expect(store.state.entities.users.data['2']).toBe(undefined)
  })
})
