import { createApplication, createState } from 'test/support/Helpers'
import Model from 'app/Model'
import Repo from 'app/repo/Repo'

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

describe('Repo – Retrieve – Relations – Belongs To Many', () => {
  beforeEach(() => {
    createApplication('entities', [{ model: User }, { model: Role }, { model: RoleUser }])
  })

  it('can resolve belongs to many relation', () => {
    const state = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, roles: [2, 3] }
      },
      roles: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      },
      roleUser: {
        '1_2': { $id: '1_2', user_id: 1, role_id: 2  },
        '1_3': { $id: '1_3', user_id: 1, role_id: 3 }
      }
    })

    const user = Repo.query(state, 'users').with('roles').find(1)

    expect(user).toBeInstanceOf(User)
    expect(user.roles.length).toBe(2)
    expect(user.roles[0]).toBeInstanceOf(Role)
    expect(user.roles[1]).toBeInstanceOf(Role)
    expect(user.roles[0].id).toBe(2)
    expect(user.roles[1].id).toBe(3)
  })

  it('can resolve inverse belongs to many relation', () => {
    const state = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, roles: [2, 3] }
      },
      roles: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      },
      roleUser: {
        '1_2': { $id: '1_2', user_id: 1, role_id: 2  },
        '1_3': { $id: '1_3', user_id: 1, role_id: 3 }
      }
    })

    const role = Repo.query(state, 'roles').with('users').find(2)

    expect(role).toBeInstanceOf(Role)
    expect(role.users.length).toBe(1)
    expect(role.users[0]).toBeInstanceOf(User)
    expect(role.users[0].id).toBe(1)
  })

  it('can resolve belongs to many relation with has constraint', () => {
    const state = createState('entities', {
      users: {
        '1': { $id: 1, id: 1, roles: [2, 3] }
      },
      roles: {
        '2': { $id: 2, id: 2, users: [] },
        '3': { $id: 3, id: 3, users: [] }
      },
      roleUser: {
        '1_2': { $id: '1_2', user_id: 1, role_id: 2  },
        '1_3': { $id: '1_3', user_id: 1, role_id: 3 },
        '2_4': { $id: '2_4', user_id: 2, role_id: 4 }
      }
    })

    const roles = Repo.query(state, 'roles').has('users').get(2)

    expect(roles.length).toBe(2)
  })
})
