import { createStore, createState } from 'test/support/Helpers'
import Uid from '@/support/Uid'
import Model from '@/model/Model'

describe('Feature – Attributes – Uid', () => {
  beforeEach(() => {
    Uid.reset()
  })

  describe('without default value', () => {
    class User extends Model {
      static entity = 'users'

      // @Uid
      id!: string

      // @Uid
      id2!: string

      static fields() {
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
          $uid1: { $id: '$uid1', id: '$uid1', id2: '$uid4' },
          $uid2: { $id: '$uid2', id: '$uid2', id2: '$uid5' },
          $uid3: { $id: '$uid3', id: '$uid3', id2: '$uid6' }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })

    it('will do nothing if the value exists', async () => {
      const store = createStore([{ model: User }])

      await User.create({
        data: [
          { id: 1, id2: 'id1' },
          { id: 2, id2: 'id2' }
        ]
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

      // @Uid(() => 1)
      id!: number

      // @Uid(() => 2)
      id2!: number

      static fields() {
        return {
          id: this.uid(() => 1),
          id2: this.uid(() => 2)
        }
      }
    }

    it('generates user provided uid as a default value', async () => {
      const store = createStore([{ model: User }])

      await User.create({ data: [{}] })

      const expected = createState({
        users: {
          1: { $id: '1', id: 1, id2: 2 }
        }
      })

      expect(store.state.entities).toEqual(expected)
    })
  })
})
