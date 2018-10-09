import { createStore, createState, refreshNoKey } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Attributes – Increment', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.increment(),
        name: this.attr(''),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    static fields () {
      return {
        id: this.increment(),
        user_id: this.attr(null),
      }
    }
  }

  beforeEach(() => {
    refreshNoKey()
  })

  it('should increment the field value when creating a record', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: { name: '' }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
  })

  it('should increment value when creating multiple records', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [{ name: '' }, { name: '' }]
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['2'].id).toBe(2)
  })

  it('should increment value when creating multiple records with some field value defined', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { name: '' },
        { id: 8, name: '' }
      ]
    })

    expect(store.state.entities.users.data['8'].id).toBe(8)
    expect(store.state.entities.users.data['9'].id).toBe(9)
  })

  it('should increment the field value when inserting record', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1, name: 'John' },
        { id: 3, name: 'Jane' }
      ]
    })

    await User.insert({
      data: { name: 'John' }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['3'].id).toBe(3)
    expect(store.state.entities.users.data['4'].id).toBe(4)
  })

  it('should increment the multiple field value when inserting record', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1, name: 'John' },
        { id: 3, name: 'Jane' }
      ]
    })

    await User.insert({
      data: [
        { name: 'John' },
        { name: 'Josh' }
      ]
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['3'].id).toBe(3)
    expect(store.state.entities.users.data['4'].id).toBe(4)
    expect(store.state.entities.users.data['5'].id).toBe(5)
  })

  it('should increment the multiple field value with some passed data has increment value defined when inserting record', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1, name: 'John' },
        { id: 3, name: 'Jane' }
      ]
    })

    await User.insert({
      data: [
        { name: 'John' },
        { id: 8, name: 'Josh' }
      ]
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['3'].id).toBe(3)
    expect(store.state.entities.users.data['8'].id).toBe(8)
    expect(store.state.entities.users.data['9'].id).toBe(9)
  })

  it('should increment value when inserting multiple records and multiple increment field', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.increment(),
          otherId: this.increment(),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    await User.create({
      data: { id: 3, otherId: 5, name: 'Jane' }
    })

    await User.insert({
      data: [
        { name: 'John' },
        { name: 'Johnny' }
      ]
    })

    expect(store.state.entities.users.data['4'].id).toBe(4)
    expect(store.state.entities.users.data['4'].otherId).toBe(6)
    expect(store.state.entities.users.data['5'].id).toBe(5)
    expect(store.state.entities.users.data['5'].otherId).toBe(7)
  })

  it('should increment value of relation field', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await User.create({
      data: {
        name: 'John',
        posts: [
          { user_id: 1, title: 'Title 01' },
          { user_id: 2, title: 'Title 02' }
        ]
      }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['2'].id).toBe(2)
  })

  it('should increment the field value when inserting record via insertOrUpdate', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1, name: 'John' },
        { id: 3, name: 'Jane' }
      ]
    })

    await User.insertOrUpdate({
      data: { name: 'Johnny' }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['3'].id).toBe(3)
    expect(store.state.entities.users.data['4'].id).toBe(4)
  })

  it('should increment the multiple field value when inserting record via insertOrUpdate', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1, name: 'John' },
        { id: 3, name: 'Jane' }
      ]
    })

    await User.insertOrUpdate({
      data: [{ name: 'Johnny' }, { name: 'Josh' }]
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['3'].id).toBe(3)
    expect(store.state.entities.users.data['4'].id).toBe(4)
    expect(store.state.entities.users.data['5'].id).toBe(5)
  })

  it('should increment the multiple field value with some passed data has increment value defined when inserting record via insertOrUpdate', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 1, name: 'John' },
        { id: 3, name: 'Jane' }
      ]
    })

    await User.insertOrUpdate({
      data: [{ name: 'Johnny' }, { id: 8, name: 'Josh' }]
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['3'].id).toBe(3)
    expect(store.state.entities.users.data['8'].id).toBe(8)
    expect(store.state.entities.users.data['9'].id).toBe(9)
  })

  it('should increment value when inserting multiple records and multiple increment field via insertOrUpdate', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.increment(),
          otherId: this.increment(),
          name: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }])

    await User.create({
      data: [
        { id: 3, otherId: 5, name: 'Jane' }
      ]
    })

    await User.insertOrUpdate({
      data: [{ name: 'John' }, { name: 'Johnny' }]
    })

    expect(store.state.entities.users.data['4'].id).toBe(4)
    expect(store.state.entities.users.data['4'].otherId).toBe(6)
    expect(store.state.entities.users.data['5'].id).toBe(5)
    expect(store.state.entities.users.data['5'].otherId).toBe(7)
  })

  it('should increment value of relation field via insertOrUpdate', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    await User.create({
      data: {
        name: 'John',
        posts: [
          { user_id: 1, title: 'Title 01' },
          { user_id: 2, title: 'Title 02' }
        ]
      }
    })

    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['1'].id).toBe(1)
    expect(store.state.entities.posts.data['2'].id).toBe(2)
  })

  it('converts a non-number value to the `null` when creating a record', async () => {
    const store = createStore([{ model: User }])

    await User.create({
      data: { id: 'Not number' }
    })

    expect(store.state.entities.users.data['1'].id).toEqual(1)
  })

  it('converts a non-number value to the `null` when instantiating a model', async () => {
    const user = new User({ id: 'Not number' })

    expect(user.id).toBe(null)
  })
})
