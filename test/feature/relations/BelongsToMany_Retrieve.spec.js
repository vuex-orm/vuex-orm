import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Relations – Belongs To Many – Retrieve', () => {
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

  it('can resolve belongs to many relation', async () => {
    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({
      data: { id: 1 }
    })

    await Role.create({
      data: [{ id: 2 }, { id: 3 }]
    })

    await RoleUser.create({
      data: [
        { user_id: 1, role_id: 2 },
        { user_id: 1, role_id: 3 }
      ]
    })

    const user = User.query().with('roles').find(1)

    expect(user.roles.length).toBe(2)
    expect(user.roles[0].id).toBe(2)
    expect(user.roles[1].id).toBe(3)
  })

  it('can resolve inverse belongs to many relation', async () => {
    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({
      data: { id: 1 }
    })

    await Role.create({
      data: [{ id: 2 }, { id: 3 }]
    })

    await RoleUser.create({
      data: [
        { user_id: 1, role_id: 2 },
        { user_id: 1, role_id: 3 }
      ]
    })

    const role = Role.query().with('users').find(2)

    expect(role.users.length).toBe(1)
    expect(role.users[0].id).toBe(1)
  })

  it('can resolve belongs to many relation with has constraint', async () => {
    const store = createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({
      data: { id: 1 }
    })

    await Role.create({
      data: [{ id: 2 }, { id: 3 }]
    })

    await RoleUser.create({
      data: [
        { user_id: 1, role_id: 2 },
        { user_id: 1, role_id: 3 },
        { user_id: 2, role_id: 4 }
      ]
    })

    const roles = Role.query().has('users').get(2)

    expect(roles.length).toBe(2)
  })
})
