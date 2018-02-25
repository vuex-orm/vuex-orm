import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'
import Data from 'app/data/Data'

describe('Data – Relations – Has One', () => {
  it('can normalize the has one relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      id: 1,
      phone: { id: 2, user_id: 1 }
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, phone: 2 }
      },
      phones: {
        '2': { $id: 2, id: 2, user_id: 1 }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize list of has one relation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    const repo = new Repo(store.state.entities, 'users')

    const data = [
      {
        id: 1,
        phone: { id: 2, user_id: 1 }
      },
      {
        id: 2,
        phone: { id: 3, user_id: 2 }
      }
    ]

    const expected = {
      users: {
        '1': { $id: 1, id: 1, phone: 2 },
        '2': { $id: 2, id: 2, phone: 3 }
      },
      phones: {
        '2': { $id: 2, id: 2, user_id: 1 },
        '3': { $id: 3, id: 3, user_id: 2}
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Phone }])

    const repo = new Repo(store.state.entities, 'users')

    const data = {
      id: 1,
      phone: { id: 2 }
    }

    const expected = {
      users: {
        '1': { $id: 1, id: 1, phone: 2 }
      },
      phones: {
        '2': { $id: 2, id: 2, user_id: 1 }
      }
    }

    const normalizedData = Data.normalize(data, repo)

    expect(Data.fillAll(normalizedData, repo)).toEqual(expected)
  })
})
