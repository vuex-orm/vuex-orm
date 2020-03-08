import { createStore } from 'test/support/Helpers'
import { Model, Query } from 'app/index'

describe('Feature - Repositories - CRUD Retrieve', () => {
  it('can get a new query instance', () => {
    class User extends Model {
      static entity = 'users'
    }

    const store = createStore([User])

    const query = store.$repo(User).query()

    expect(query).toBeInstanceOf(Query)
  })

  it('can get all records', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }

      id!: number
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    await userRepo.insert({
      data: [{ id: 1 }, { id: 2 }]
    })

    const users = userRepo.all()

    expect(users.length).toBe(2)
    expect(users[0].id).toBe(1)
    expect(users[1].id).toBe(2)
  })

  it('can find a single record', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }

      id!: number
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    await userRepo.insert({
      data: [{ id: 1 }, { id: 2 }]
    })

    const user = userRepo.find(2) as User

    expect(user.id).toBe(2)
  })

  it('can find a single record with composite primary key', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['idA', 'idB']

      static fields () {
        return {
          idA: this.attr(null),
          idB: this.attr(null)
        }
      }

      idA!: number
      idB!: number
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    await userRepo.insert({
      data: [{ idA: 1, idB: 2 }, { idA: 3, idB: 4 }]
    })

    const user = userRepo.find([1, 2]) as User

    expect(user.idA).toBe(1)
    expect(user.idB).toBe(2)
  })

  it('can find records by ids', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }

      id!: number
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    await userRepo.insert({
      data: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })

    const users = userRepo.findIn([1, 3])

    expect(users[0].id).toBe(1)
    expect(users[1].id).toBe(3)
  })

  it('can find records by ids with composite primary key', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['idA', 'idB']

      static fields () {
        return {
          idA: this.attr(null),
          idB: this.attr(null)
        }
      }

      idA!: number
      idB!: number
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    await userRepo.insert({
      data: [{ idA: 1, idB: 2 }, { idA: 3, idB: 4 }, { idA: 5, idB: 6 }]
    })

    const users = userRepo.findIn([[1, 2], [5, 6]])

    expect(users[0].idA).toBe(1)
    expect(users[0].idB).toBe(2)
    expect(users[1].idA).toBe(5)
    expect(users[1].idB).toBe(6)
  })

  it('can check whether record exists', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([User])

    const userRepo = store.$repo(User)

    expect(userRepo.exists()).toBe(false)

    await userRepo.insert({
      data: { id: 1 }
    })

    expect(userRepo.exists()).toBe(true)
  })
})
