import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Query – Create – Belongs To Many', () => {
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

    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    const state = {
      $name: 'entities',
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
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, roles: [] }
      }},
      roles: { data: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      }},
      roleUser: { data: {
        '2_1': { $id: '2_1', user_id: 1, role_id: 2  },
        '3_1': { $id: '3_1', user_id: 1, role_id: 3 }
      }}
    }

    Query.create(state, 'users', data)

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

      static primaryKey = ['role_id', 'user_id']

      static fields () {
        return {
          id: this.increment(),
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    const state = {
      $name: 'entities',
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
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, roles: [] }
      }},
      roles: { data: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      }},
      roleUser: { data: {
        '2_1': { $id: '2_1', id: 1, user_id: 1, role_id: 2  },
        '3_1': { $id: '3_1', id: 2, user_id: 1, role_id: 3 }
      }}
    }

    Query.create(state, 'users', data)

    expect(state).toEqual(expected)
  })

  it('can create a belongs to many relation data from nested data', () => {
    class Team extends Model {
      static entity = 'teams'

      static fields () {
        return {
          id: this.attr(null),
          users: this.hasMany(User, 'team_id')
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          team_id: this.attr(null),
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

    createStore([{ model: Team }, { model: User }, { model: Role }, { model: RoleUser }])

    const state = {
      $name: 'entities',
      teams: { data: {} },
      users: { data: {} },
      roles: { data: {} },
      roleUser: { data: {} }
    }

    const data = {
      id: 1,
      users: [{
        team_id: 1,
        id: 1,
        roles: [
          { id: 2 },
          { id: 3 }
        ]
      }]
    }

    const expected = {
      $name: 'entities',
      teams: { data: {
        '1': { $id: 1, id: 1, users: [] }
      }},
      users: { data: {
        '1': { $id: 1, id: 1, team_id: 1, roles: [] }
      }},
      roles: { data: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      }},
      roleUser: { data: {
        '2_1': { $id: '2_1', user_id: 1, role_id: 2  },
        '3_1': { $id: '3_1', user_id: 1, role_id: 3 }
      }}
    }

    Query.create(state, 'teams', data)

    expect(state).toEqual(expected)
  })
})
