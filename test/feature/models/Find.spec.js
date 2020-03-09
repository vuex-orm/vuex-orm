import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Models – Find', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  describe('#static', () => {
    it('can fetch a record', async () => {
      createStore([{ model: User }])

      await User.insert({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' }
        ]
      })

      const user = User.find(1)

      const expected = { $id: '1', id: 1, name: 'John Doe' }

      expect(user).toEqual(expected)
      expect(user).toBeInstanceOf(User)
    })

    it('can fetch array of records', async () => {
      createStore([{ model: User }])

      await User.insert({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
          { id: 3, name: 'Smith Doe' }
        ]
      })

      const users = User.findIn([1, 3])

      const expected = [
        { $id: '1', id: 1, name: 'John Doe' },
        { $id: '3', id: 3, name: 'Smith Doe' }
      ]

      expect(users).toEqual(expected)
      expect(users[0]).toBeInstanceOf(User)
      expect(users[1]).toBeInstanceOf(User)
    })

    it('returns empty collection when passing a primitive value', async () => {
      createStore([{ model: User }])

      await User.insert({
        data: { id: 1, name: 'John Doe' }
      })

      const user = User.findIn(1)

      expect(user).toEqual([])
    })

    it('throws error when passing non-primitive value to `find`', async () => {
      createStore([{ model: User }])

      expect(() => User.find([1, 1])).toThrowError('[Vuex ORM]')
    })
  })

  describe('#instance', () => {
    it('can fetch a record', async () => {
      createStore([{ model: User }])

      await User.insert({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' }
        ]
      })

      const u = new User()

      const user = u.$find(1)

      const expected = { $id: '1', id: 1, name: 'John Doe' }

      expect(user).toEqual(expected)
      expect(user).toBeInstanceOf(User)
    })

    it('can fetch array of records', async () => {
      createStore([{ model: User }])

      await User.insert({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
          { id: 3, name: 'Smith Doe' }
        ]
      })

      const u = new User()

      const users = u.$findIn([1, 3])

      const expected = [
        { $id: '1', id: 1, name: 'John Doe' },
        { $id: '3', id: 3, name: 'Smith Doe' }
      ]

      expect(users).toEqual(expected)
      expect(users[0]).toBeInstanceOf(User)
      expect(users[1]).toBeInstanceOf(User)
    })

    it('returns empty collection when passing a primitive value', async () => {
      createStore([{ model: User }])

      await User.insert({
        data: { id: 1, name: 'John Doe' }
      })

      const u = new User()

      const user = u.$findIn(1)

      expect(user).toEqual([])
    })

    it('throws error when passing non-primitive value to `find`', async () => {
      createStore([{ model: User }])

      const u = new User()

      expect(() => u.$find([1, 1])).toThrowError('[Vuex ORM]')
    })
  })

  describe('with composite primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['workspace_id', 'id']

      static fields () {
        return {
          workspace_id: this.attr(null),
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    describe('#static', () => {
      it('can fetch a record', async () => {
        createStore([{ model: User }])

        await User.insert({
          data: [
            { id: 1, workspace_id: 1, name: 'John Doe' },
            { id: 2, workspace_id: 1, name: 'Jane Doe' }
          ]
        })

        const user = User.find([1, 1])

        const expected = { $id: '[1,1]', id: 1, workspace_id: 1, name: 'John Doe' }

        expect(user).toEqual(expected)
        expect(user).toBeInstanceOf(User)
      })

      it('can fetch array of records', async () => {
        createStore([{ model: User }])

        await User.insert({
          data: [
            { id: 1, workspace_id: 1, name: 'John Doe' },
            { id: 2, workspace_id: 1, name: 'Jane Doe' },
            { id: 3, workspace_id: 1, name: 'Smith Doe' }
          ]
        })

        const users = User.findIn([[1, 1], [1, 3]])

        const expected = [
          { $id: '[1,1]', id: 1, workspace_id: 1, name: 'John Doe' },
          { $id: '[1,3]', id: 3, workspace_id: 1, name: 'Smith Doe' }
        ]

        expect(users).toEqual(expected)
        expect(users[0]).toBeInstanceOf(User)
        expect(users[1]).toBeInstanceOf(User)
      })

      it('throws error when passing value other than an array to `find`', async () => {
        createStore([{ model: User }])

        expect(() => User.find(1)).toThrowError('[Vuex ORM]')
      })

      it('throws error when passing value other than a nested array to `findIn`', async () => {
        createStore([{ model: User }])

        expect(() => User.findIn([1, 1])).toThrowError('[Vuex ORM]')
      })
    })

    describe('#instance', () => {
      it('can fetch a record', async () => {
        createStore([{ model: User }])

        await User.insert({
          data: [
            { id: 1, workspace_id: 1, name: 'John Doe' },
            { id: 2, workspace_id: 1, name: 'Jane Doe' }
          ]
        })

        const u = new User()

        const user = u.$find([1, 1])

        const expected = { $id: '[1,1]', id: 1, workspace_id: 1, name: 'John Doe' }

        expect(user).toEqual(expected)
        expect(user).toBeInstanceOf(User)
      })

      it('can fetch array of records', async () => {
        createStore([{ model: User }])

        await User.insert({
          data: [
            { id: 1, workspace_id: 1, name: 'John Doe' },
            { id: 2, workspace_id: 1, name: 'Jane Doe' },
            { id: 3, workspace_id: 1, name: 'Smith Doe' }
          ]
        })

        const u = new User()

        const users = u.$findIn([[1, 1], [1, 3]])

        const expected = [
          { $id: '[1,1]', id: 1, workspace_id: 1, name: 'John Doe' },
          { $id: '[1,3]', id: 3, workspace_id: 1, name: 'Smith Doe' }
        ]

        expect(users).toEqual(expected)
        expect(users[0]).toBeInstanceOf(User)
        expect(users[1]).toBeInstanceOf(User)
      })

      it('throws error when passing value other than an array to `find`', async () => {
        createStore([{ model: User }])

        const u = new User()

        expect(() => u.$find(1)).toThrowError('[Vuex ORM]')
      })

      it('throws error when passing value other than a nested array to `findIn`', async () => {
        createStore([{ model: User }])

        const u = new User()

        expect(() => u.$findIn([1, 1])).toThrowError('[Vuex ORM]')
      })
    })
  })
})
