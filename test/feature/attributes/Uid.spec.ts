import { createStore, createState } from 'test/support/Helpers'
import Uid from 'app/support/Uid'
import { Model, Fields } from 'app/index'

describe('Feature – Attributes – Uid', () => {
  beforeEach(() => { Uid.reset() })

  describe('no default value', () => {
    class User extends Model {
      static entity = 'users'

      static fields (): Fields {
        return {
          id: this.uid(),
          id2: this.uid()
        }
      }
    }

    it('generates uid as a default value', async () => {
      const store = createStore([{ model: User }])

      await User.create({
        data: [{}, {}, {}]
      })

      const expected = createState({
        users: {
          $uuid1: { $id: '$uuid1', id: '$uuid1', id2: '$uuid4' },
          $uuid2: { $id: '$uuid2', id: '$uuid2', id2: '$uuid5' },
          $uuid3: { $id: '$uuid3', id: '$uuid3', id2: '$uuid6' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('will do nothing if the value exists', async () => {
      const store = createStore([{ model: User }])

      await User.create({
        data: [{ id: 1, id2: 'id1' }, { id: 2, id2: 'id2' }]
      })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, id2: 'id1' },
          2: { $id: '2', id: 2, id2: 'id2' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })
  })

  describe('with default value', () => {
    class User extends Model {
      static entity = 'users'

      static fields (): Fields {
        return {
          id: this.uid(() => 1),
          id2: this.uid(() => 2)
        }
      }
    }

    it('generates user provided uid as a default value', async () => {
      const store = createStore([{ model: User }])

      await User.create({
        data: [{}]
      })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, id2: 2 }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })
  })
})
