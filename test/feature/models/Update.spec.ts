import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Models – Update', () => {
  class User extends Model {
    static entity = 'users'

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

  describe('#static', () => {
    it('can update a record by passing in the id', async () => {
      const store = createStore([{ model: User }])

      await User.insert({
        data: { id: 1, name: 'John Doe' }
      })

      await User.update({ id: 1, name: 'Jane Doe' })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'Jane Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('can update a record by passing where value', async () => {
      const store = createStore([{ model: User }])

      await User.insert({
        data: { id: 1, name: 'John Doe' }
      })

      await User.update({
        where: 1,
        data: { name: 'Jane Doe' }
      })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'Jane Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('can update records by passing where closure', async () => {
      const store = createStore([{ model: User }])

      await User.insert({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
          { id: 3, name: 'Jane Doe' }
        ]
      })

      await User.update({
        where (record) {
          return record.name === 'Jane Doe'
        },

        data: { name: 'John Doe' }
      })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'John Doe' },
          2: { $id: '2', id: 2, name: 'John Doe' },
          3: { $id: '3', id: 3, name: 'John Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('can update a record by passing data closure', async () => {
      const store = createStore([{ model: User }])

      await User.insert({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
          { id: 3, name: 'Jane Doe' }
        ]
      })

      await User.update({
        where: 1,

        data (record: User) {
          record.name = 'Jane Doe'
        }
      })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'Jane Doe' },
          2: { $id: '2', id: 2, name: 'Jane Doe' },
          3: { $id: '3', id: 3, name: 'Jane Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })
  })

  describe('#instance', () => {
    it('can update a record', async () => {
      const store = createStore([{ model: User }])

      const user = new User()

      await User.insert({
        data: { id: 1, name: 'John Doe' }
      })

      await user.$update({ id: 1, name: 'Jane Doe' })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'Jane Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('can omit id when updating', async () => {
      const store = createStore([{ model: User }])

      await User.insert({
        data: { id: 1, name: 'John Doe' }
      })

      const user = store.getters['entities/users/find'](1)

      await user.$update({ name: 'Jane Doe' })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'Jane Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('can omit id when updating where model has a composite primary key', async () => {
      class Role extends Model {
        static entity = 'roles'

        static primaryKey = ['key_1', 'key_2']

        static fields () {
          return {
            key_1: this.uid(),
            key_2: this.uid(),
            name: this.attr('')
          }
        }
      }

      const store = createStore([{ model: Role }])

      await Role.insert({ key_1: 1, key_2: 2, name: 'John Doe' })

      const user = Role.find([1, 2]) as Role

      await user.$update({ name: 'Jane Doe' })

      const expected = createState({
        roles: {
          '[1,2]': { $id: '[1,2]', key_1: 1, key_2: 2, name: 'Jane Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('can update a record passing array of records', async () => {
      const store = createStore([{ model: User }])

      await User.insert({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' }
        ]
      })

      const user = store.getters['entities/users/find'](1)

      await user.$update([
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'Johnny Doe' }
      ])

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'Jane Doe' },
          2: { $id: '2', id: 2, name: 'Johnny Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('can update a record by passing where value', async () => {
      const store = createStore([{ model: User }])

      const user = new User()

      await User.insert({
        data: { id: 1, name: 'John Doe' }
      })

      await user.$update({ name: 'Jane Doe' }, { where: 1 })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, name: 'Jane Doe' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })
  })
})
