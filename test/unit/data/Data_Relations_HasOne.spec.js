import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'
import Data from 'app/data/Data'
import NoKey from 'app/data/NoKey'

describe('Data – Relations – Has One', () => {
  beforeEach(() => { NoKey.count = 0 })

  afterEach(() => { NoKey.count = 0 })

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

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field without parent primary key', () => {
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
      phone: { id: 2 }
    }

    const expected = {
      users: {
        '_no_key_1': { $id: '_no_key_1', id: '_no_key_1', phone: 2 }
      },
      phones: {
        '2': { $id: 2, id: 2, user_id: '_no_key_1' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field without parent primary key on list of data', () => {
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
        phone: { id: 1 }
      },
      {
        phone: { id: 2 }
      }
    ]

    const expected = {
      users: {
        '_no_key_1': { $id: '_no_key_1', id: '_no_key_1', phone: 1 },
        '_no_key_2': { $id: '_no_key_2', id: '_no_key_2', phone: 2 }
      },
      phones: {
        '1': { $id: 1, id: 1, user_id: '_no_key_1' },
        '2': { $id: 2, id: 2, user_id: '_no_key_2' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field without any primary key', () => {
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
        phone: {}
      },
      {
        phone: {}
      }
    ]

    const expected = {
      users: {
        '_no_key_1': { $id: '_no_key_1', id: '_no_key_1', phone: '_no_key_2' },
        '_no_key_3': { $id: '_no_key_3', id: '_no_key_3', phone: '_no_key_4' }
      },
      phones: {
        '_no_key_2': { $id: '_no_key_2', user_id: '_no_key_1' },
        '_no_key_4': { $id: '_no_key_4', user_id: '_no_key_3' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'u_id'

      static fields () {
        return {
          u_id: this.attr(null),
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
        phone: {}
      },
      {
        phone: {}
      }
    ]

    const expected = {
      users: {
        '_no_key_1': { $id: '_no_key_1', u_id: '_no_key_1', phone: '_no_key_2' },
        '_no_key_3': { $id: '_no_key_3', u_id: '_no_key_3', phone: '_no_key_4' }
      },
      phones: {
        '_no_key_2': { $id: '_no_key_2', user_id: '_no_key_1' },
        '_no_key_4': { $id: '_no_key_4', user_id: '_no_key_3' }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can generate relation field with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          u_id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id', 'u_id')
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
        phone: { id: 3 }
      },
      {
        id: 2,
        phone: { id: 4 }
      }
    ]

    const expected = {
      users: {
        '1': { $id: 1, id: 1, u_id: 1, phone: 3 },
        '2': { $id: 2, id: 2, u_id: 2, phone: 4 }
      },
      phones: {
        '3': { $id: 3, id: 3, user_id: 1 },
        '4': { $id: 4, id: 4, user_id: 2 }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })
})
