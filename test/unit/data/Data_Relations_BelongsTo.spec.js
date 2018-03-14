import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'
import Data from 'app/data/Data'

describe('Data – Relations – Belongs To', () => {
  it('can normalize the belongs to relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    const repo = new Query(store.state.entities, 'phones')

    const data = {
      id: 1,
      user_id: 1,
      user: { id: 1 }
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1 }
      },
      phones: {
        '1': { $id: 1, id: 1, user_id: 1, user: 1 }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize list of belongs to relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    const repo = new Query(store.state.entities, 'phones')

    const data = [
      {
        id: 1,
        user_id: 1,
        user: { id: 1 }
      },
      {
        id: 2,
        user_id: 2,
        user: { id: 2 }
      }
    ]

    const expected = {
      users: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 }
      },
      phones: {
        '1': { $id: 1, id: 1, user_id: 1, user: 1 },
        '2': { $id: 2, id: 2, user_id: 2, user: 2 }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          user: this.belongsTo(User, 'user_id')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    const repo = new Query(store.state.entities, 'phones')

    const data = {
      id: 1,
      user: { id: 1 }
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1 }
      },
      phones: {
        '1': { $id: 1, id: 1, user_id: 1, user: 1 }
      }
    }

    const normalizedData = Data.normalize(data, repo)

    expect(Data.fillAll(normalizedData, repo)).toEqual(expected)
  })
})
