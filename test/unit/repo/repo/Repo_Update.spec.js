import { createApplication, createState } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import CustomKey from 'test/fixtures/models/CustomKey'
import CompositeKey from 'test/fixtures/models/CompositeKey'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'

describe('Repo – Update', () => {
  beforeEach(() => {
    createApplication('entities', [
      { model: User },
      { model: Profile },
      { model: Post },
      { model: Comment },
      { model: Review },
      { model: Like },
      { model: CustomKey },
      { model: CompositeKey }
    ])
  })

  it('can update record by including primary key in the data', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 30 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 24 }
      }}
    }

    Repo.update(state, 'users', { id: 2, age: 24 })
    Repo.update(state, 'users', { id: 3, age: 24 })

    expect(state).toEqual(expected)
  })

  it('can update record by including composite primary key in the data', () => {
    const state = {
      name: 'entities',
      compositeKeys: { data: {
        '1_1': { user_id: 1, vote_id: 1, text: 'John' },
        '2_1': { user_id: 2, vote_id: 1, text: 'Jane' }
      }}
    }

    const expected = {
      name: 'entities',
      compositeKeys: { data: {
        '1_1': { user_id: 1, vote_id: 1, text: 'John' },
        '2_1': { user_id: 2, vote_id: 1, text: 'Judy' }
      }}
    }

    Repo.update(state, 'compositeKeys', { user_id: 2, vote_id: 1, text: 'Judy' })
    Repo.update(state, 'compositeKeys', { user_id: 3, vote_id: 3, text: 'Johnny' })

    expect(state).toEqual(expected)
  })

  it('can update record by specifying condition with id', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 30 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 24 }
      }}
    }

    Repo.update(state, 'users', { age: 24 }, 2)
    Repo.update(state, 'users', { age: 24 }, 3)

    expect(state).toEqual(expected)
  })

  it('can update record by specifying condition with composite primary key', () => {
    const state = {
      name: 'entities',
      compositeKeys: { data: {
        '1_1': { user_id: 1, vote_id: 1, text: 'John' },
        '2_1': { user_id: 2, vote_id: 1, text: 'Jane' }
      }}
    }

    const expected = {
      name: 'entities',
      compositeKeys: { data: {
        '1_1': { user_id: 1, vote_id: 1, text: 'Johnny' },
        '2_1': { user_id: 2, vote_id: 1, text: 'Jane' }
      }}
    }

    Repo.update(state, 'compositeKeys', { text: 'Johnny' }, '1_1')
    Repo.update(state, 'compositeKeys', { text: 'Joseph' }, '3_2')

    expect(state).toEqual(expected)
  })

  it('can update record by specifying condition with closure', () => {
    const state = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 30 }
      }}
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { id: 1, name: 'John', age: 20 },
        '2': { id: 2, name: 'Jane', age: 24 }
      }}
    }

    Repo.update(state, 'users', { age: 24 }, record => record.name === 'Jane')
    Repo.update(state, 'users', { age: 24 }, record => record.id === 3)

    expect(state).toEqual(expected)
  })

  it('returns a updated object by including primary key in the data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }])

    const state = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'John', age: 20 }
      }
    })

    const user = Repo.update(state, 'users', { id: 1, age: 24 })

    expect(user).toBeInstanceOf(User)
    expect(user.age).toBe(24)
  })

  it('returns a updated object by specifying condition', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }])

    const state = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'John', age: 20 }
      }
    })

    const user = Repo.update(state, 'users', { age: 24 }, 1)

    expect(user).toBeInstanceOf(User)
    expect(user.age).toBe(24)
  })

  it('returns a updated object by specifying condition as closure', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }])

    const state = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'John', age: 20 }
      }
    })

    const users = Repo.update(state, 'users', { age: 24 }, record => record.id === 1)

    expect(users.length).toBe(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].age).toBe(24)
  })

  it('returns all updated object by specifying condition as closure', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          age: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }])

    const state = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, name: 'JD', age: 20 },
        '2': { $id: 2, id: 2, name: 'JD', age: 20 },
        '3': { $id: 3, id: 3, name: 'Johnny', age: 30 }
      }
    })

    const users = Repo.update(state, 'users', { age: 24 }, record => record.name === 'JD')

    expect(users.length).toBe(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].age).toBe(24)
    expect(users[1]).toBeInstanceOf(User)
    expect(users[1].age).toBe(24)
  })
})
