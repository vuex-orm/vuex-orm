import { createApplication } from 'test/support/Helpers'
import Model from 'app/Model'
import Repo from 'app/repo/Repo'

describe('Repo – Create – Belongs To Many', () => {
  it('can create a belongs to many relation data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null),
          users: this.belongsToMany(User, RoleUser, 'role_id', 'user_id')
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      static fields () {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Role }, { model: RoleUser }])

    const state = {
      name: 'entities',
      users: { data: {} },
      roles: { data: {} },
      roleUser: { data: {} }
    }

    const data = {
      id: 1,
      roles: [
        { id: 2 },
        { id: 3 }
      ]
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, roles: [2, 3] }
      }},
      roles: { data: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      }},
      roleUser: { data: {
        '1_2': { $id: '1_2', user_id: 1, role_id: 2  },
        '1_3': { $id: '1_3', user_id: 1, role_id: 3 }
      }}
    }

    Repo.create(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can create a belongs to many relation data with increment id', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null),
          users: this.belongsToMany(User, RoleUser, 'role_id', 'user_id')
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static fields () {
        return {
          id: this.increment(),
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createApplication('entities', [{ model: User }, { model: Role }, { model: RoleUser }])

    const state = {
      name: 'entities',
      users: { data: {} },
      roles: { data: {} },
      roleUser: { data: {} }
    }

    const data = {
      id: 1,
      roles: [
        { id: 2 },
        { id: 3 }
      ]
    }

    const expected = {
      name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, roles: [2, 3] }
      }},
      roles: { data: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      }},
      roleUser: { data: {
        '1': { $id: 1, id: 1, user_id: 1, role_id: 2  },
        '2': { $id: 2, id: 2, user_id: 1, role_id: 3 }
      }}
    }

    Repo.create(state, 'users', data)

    expect(state).toEqual(expected)
  })
})
