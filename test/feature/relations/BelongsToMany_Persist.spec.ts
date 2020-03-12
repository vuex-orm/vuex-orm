import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Feature – Relations – Belongs To Many – Persist', () => {
  it('can create a data with belongs to many relation', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          permissions: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      static fields () {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null),
          level: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await store.dispatch('entities/users/create', {
      data: {
        id: 1,
        permissions: [{ id: 1, pivot: { level: 1 } }, { id: 2 }]
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, permissions: [] }
      },
      roles: {
        1: { $id: '1', id: 1 },
        2: { $id: '2', id: 2 }
      },
      roleUser: {
        '[1,1]': { $id: '[1,1]', role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { $id: '[2,1]', role_id: 2, user_id: 1, level: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create a data with belongs to many relation where pivot composite key reversed', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          permissions: this.belongsToMany(Role, UserRole, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class UserRole extends Model {
      static entity = 'userRole'

      static primaryKey = ['user_id', 'role_id']

      static fields () {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Role }, { model: UserRole }])

    await store.dispatch('entities/users/create', {
      data: {
        id: 1,
        permissions: [{ id: 1 }, { id: 2 }]
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, permissions: [] }
      },
      roles: {
        1: { $id: '1', id: 1 },
        2: { $id: '2', id: 2 }
      },
      userRole: {
        '[1,1]': { $id: '[1,1]', role_id: 1, user_id: 1 },
        '[1,2]': { $id: '[1,2]', role_id: 2, user_id: 1 }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create a data without relation', async () => {
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
          id: this.attr(null)
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

    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await store.dispatch('entities/users/create', { data: { id: 1 } })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, roles: [] }
      },
      roles: {},
      roleUser: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create a belongs to many relation data from nested data', async () => {
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
          user_id: this.attr(null),
          level: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Team }, { model: User }, { model: Role }, { model: RoleUser }])

    await Team.create({
      data: {
        id: 1,
        users: [{
          team_id: 1,
          id: 1,
          roles: [
            { id: 2, pivot: { level: 1 } },
            { id: 3 }
          ]
        }]
      }
    })

    expect(store.state.entities.teams.data['1'].id).toBe(1)
    expect(store.state.entities.users.data['1'].id).toBe(1)
    expect(store.state.entities.roles.data['2'].id).toBe(2)
    expect(store.state.entities.roles.data['3'].id).toBe(3)
    expect(store.state.entities.roleUser.data['[2,1]'].$id).toStrictEqual('[2,1]')
    expect(store.state.entities.roleUser.data['[2,1]'].level).toBe(1)
    expect(store.state.entities.roleUser.data['[3,1]'].$id).toStrictEqual('[3,1]')
    expect(store.state.entities.roleUser.data['[3,1]'].level).toBe(null)
  })

  it('can retrieve data by filtering with `whereHas`', async () => {
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
          id: this.attr(null)
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

    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await store.dispatch('entities/users/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/roles/create', {
      data: [{ id: 1 }, { id: 2 }]
    })

    await store.dispatch('entities/roleUser/create', {
      data: [{ role_id: 1, user_id: 1 }, { role_id: 2, user_id: 2 }]
    })

    const users = store.getters['entities/users/query']().whereHas('roles', (query: Query) => {
      query.where('id', 2)
    }).get()

    expect(users.length).toBe(1)
    expect(users[0].id).toBe(2)
  })

  it('can create a data to pivot table with field', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          roleUsers: this.hasMany(RoleUser, 'user_id'),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUsers'

      static primaryKey = 'id'

      static fields () {
        return {
          id: this.attr(null),
          role_id: this.attr(null),
          user_id: this.attr(null),
          type: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await store.dispatch('entities/users/insert', {
      data: {
        id: 1,
        name: 'Jane Doe',
        roleUsers: [
          { id: 1, role_id: 1, user_id: 1, type: 'administrator' },
          { id: 2, role_id: 1, user_id: 1, type: 'general' },
          { id: 3, role_id: 2, user_id: 1, type: 'general' }
        ],
        roles: [
          { id: 1 },
          { id: 2 }
        ]
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe', roleUsers: [], roles: [] }
      },
      roles: {
        1: { $id: '1', id: 1 },
        2: { $id: '2', id: 2 }
      },
      roleUsers: {
        1: { $id: '1', id: 1, user_id: 1, role_id: 1, type: 'administrator' },
        2: { $id: '2', id: 2, user_id: 1, role_id: 1, type: 'general' },
        3: { $id: '3', id: 3, user_id: 1, role_id: 2, type: 'general' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create a data to pivot table with field using composite key', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          roleUsers: this.hasMany(RoleUser, 'user_id'),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUsers'

      static primaryKey = ['role_id', 'user_id']

      static fields () {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null),
          type: this.attr('')
        }
      }
    }

    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await store.dispatch('entities/users/insert', {
      data: {
        id: 1,
        name: 'Jane Doe',
        roleUsers: [
          { role_id: 1, user_id: 1, type: 'administrator' },
          { role_id: 2, user_id: 1, type: 'general' }
        ],
        roles: [
          { id: 1 },
          { id: 2 }
        ]
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe', roleUsers: [], roles: [] }
      },
      roles: {
        1: { $id: '1', id: 1 },
        2: { $id: '2', id: 2 }
      },
      roleUsers: {
        '[1,1]': { $id: '[1,1]', user_id: 1, role_id: 1, type: 'administrator' },
        '[2,1]': { $id: '[2,1]', user_id: 1, role_id: 2, type: 'general' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can create a data with belongs to many relation with pivot data having custom key', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          permissions: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id').as('role_user')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      static fields () {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null),
          level: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await store.dispatch('entities/users/insert', {
      data: {
        id: 1,
        permissions: [
          { id: 1, role_user: { level: 1 } },
          { id: 2 }
        ]
      }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, permissions: [] }
      },
      roles: {
        1: { $id: '1', id: 1 },
        2: { $id: '2', id: 2 }
      },
      roleUser: {
        '[1,1]': { $id: '[1,1]', role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { $id: '[2,1]', role_id: 2, user_id: 1, level: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
