/* tslint:disable:variable-name */
import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Relations – Belongs To Many – Retrieve', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: number

    // @BelongsToMany(Role, RoleUser, 'user_id', 'role_id')
    roles!: Role[]

    static fields () {
      return {
        id: this.attr(null),
        roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
      }
    }
  }

  class Role extends Model {
    static entity = 'roles'

    // @Attribute
    id!: number

    // @BelongsToMany(User, RoleUser, 'role_id', 'user_id')
    users!: User[]

    // @Intermediate
    pivot!: RoleUser

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

    // @Attribute
    role_id!: number

    // @Attribute
    user_id!: number

    // @Attribute
    level!: number

    static fields () {
      return {
        role_id: this.attr(null),
        user_id: this.attr(null),
        level: this.attr(null)
      }
    }
  }

  it('can resolve belongs to many relation', async () => {
    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create([{ id: 1 }, { id: 2 }])

    await Role.create([{ id: 2 }, { id: 3 }])

    await RoleUser.create([
      { user_id: 1, role_id: 2 },
      { user_id: 1, role_id: 3 }
    ])

    const user = User.query().with('roles').find(1) as User

    expect(user.roles.length).toBe(2)
    expect(user.roles[0].id).toBe(2)
    expect(user.roles[1].id).toBe(3)

    const userWithoutRoles = User.query().with('roles').find(2) as User
    expect(userWithoutRoles.roles.length).toBe(0)
  })

  it('can resolve belongs to many relation with pivot data', async () => {
    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create([
      {
        id: 1,
        roles: [
          { id: 2, pivot: { level: 1 } },
          { id: 3, pivot: { level: 2 } }
        ]
      },
      { id: 2 }
    ])

    const user = User.query().with('roles').find(1) as User

    expect(user.roles.length).toBe(2)
    expect(user.roles[0].id).toBe(2)
    expect(user.roles[0].pivot.level).toBe(1)
    expect(user.roles[1].id).toBe(3)
    expect(user.roles[1].pivot.level).toBe(2)

    const userWithoutRoles = User.query().with('roles').find(2) as User
    expect(userWithoutRoles.roles.length).toBe(0)
  })

  it('can resolve inverse belongs to many relation', async () => {
    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({ id: 1 })

    await Role.create([{ id: 2 }, { id: 3 }])

    await RoleUser.create([
      { user_id: 1, role_id: 2 },
      { user_id: 1, role_id: 3 }
    ])

    const role = Role.query().with('users').find(2) as Role

    expect(role.users.length).toBe(1)
    expect(role.users[0].id).toBe(1)
  })

  it('returns empty collection if the relation is not found', async () => {
    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({ id: 1 })

    const user = User.query().with('roles').first() as User

    expect(user.roles).toEqual([])
  })

  it('returns empty collection if the Role relation from RoleUser is not found', async () => {
    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({ id: 1 })

    await RoleUser.create([{ user_id: 1 }])

    const user = User.query().with('roles').first() as User

    expect(user.roles).toEqual([])
  })

  it('can resolve belongs to many relation with has constraint', async () => {
    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({ id: 1 })

    await Role.create([{ id: 2 }, { id: 3 }])

    await RoleUser.create([
      { user_id: 1, role_id: 2 },
      { user_id: 1, role_id: 3 },
      { user_id: 2, role_id: 4 }
    ])

    const roles = Role.query().has('users').get()

    expect(roles.length).toBe(2)
  })

  it('can resolve nested belongs to relation', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @BelongsToMany(Role, RoleUser, 'user_id', 'role_id')
      roles!: Role[]

      // @Intermediate
      pivot!: RoleUser

      static fields () {
        return {
          id: this.attr(null),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      // @Attribute
      id!: number

      // @BelongsToMany(Permission, RolePermission, 'role_id', 'permission_id')
      permissions!: Permission[]

      // @Intermediate
      pivot!: RoleUser

      static fields () {
        return {
          id: this.attr(null),
          permissions: this.belongsToMany(Permission, RolePermission, 'role_id', 'permission_id')
        }
      }
    }

    class Permission extends Model {
      static entity = 'permissions'

      // @Attribute
      id!: number

      // @Intermediate
      pivot!: RolePermission

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'role_users'

      static primaryKey = ['role_id', 'user_id']

      // @Attribute
      role_id!: number

      // @Attribute
      user_id!: number

      // @Attribute
      level!: number

      static fields () {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null),
          level: this.attr(null)
        }
      }
    }

    class RolePermission extends Model {
      static entity = 'role_permissions'

      static primaryKey = ['role_id', 'permission_id']

      // @Attribute
      role_id!: number

      // @Attribute
      permission_id!: number

      // @Attribute
      type!: string

      static fields () {
        return {
          role_id: this.attr(null),
          permission_id: this.attr(null),
          type: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Role }, { model: Permission }, { model: RoleUser }, { model: RolePermission }])

    const data = [
      {
        id: 1,
        roles: [
          {
            id: 1,
            permissions: [{ id: 1, pivot: { type: 'can' } }, { id: 2, pivot: { type: 'cant' } }, { id: 3 }, { id: 4 }],
            pivot: { level: 1 }
          }
        ]
      },
      {
        id: 2,
        roles: [
          {
            id: 2,
            permissions: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
          }
        ]
      }
    ]

    await User.create(data)

    const users = User.query().with('roles.permissions').get() as User[]

    expect(users[0].id).toBe(1)
    expect(users[0].roles.length).toBe(1)
    expect(users[0].roles[0].id).toBe(1)
    expect(users[0].roles[0].pivot.level).toBe(1)
    expect(users[0].roles[0].permissions.length).toBe(4)
    expect(users[0].roles[0].permissions[0].id).toBe(1)
    expect(users[0].roles[0].permissions[0].pivot.type).toBe('can')
    expect(users[0].roles[0].permissions[1].id).toBe(2)
    expect(users[0].roles[0].permissions[1].pivot.type).toBe('cant')
    expect(users[0].roles[0].permissions[2].pivot.type).toBe(null)

    expect(users[1].id).toBe(2)
    expect(users[1].roles.length).toBe(1)
    expect(users[1].roles[0].id).toBe(2)
    expect(users[1].roles[0].permissions.length).toBe(4)
    expect(users[1].roles[0].permissions[0].id).toBe(1)
    expect(users[1].roles[0].permissions[1].id).toBe(2)
  })

  it('can resolve belongs to relation with primary key set to id', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: number

      // @BelongsToMany(Role, RoleUser, 'user_id', 'role_id')
      roles!: Role[]

      static fields () {
        return {
          id: this.attr(null),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      // @Attribute
      id!: number

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'role_users'

      // @Attribute
      id!: number

      // @Attribute
      role_id!: number

      // @Attribute
      user_id!: number

      static fields () {
        return {
          id: this.attr(null),
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create([{ id: 1 }])

    await Role.create({ id: 1 })

    await RoleUser.create({ id: 1, user_id: 1, role_id: 1 })

    const users = User.query().with('roles').get()

    expect(users[0].id).toBe(1)
    expect(users[0].roles.length).toBe(1)
    expect(users[0].roles[0].id).toBe(1)
  })

  it('can apply `orderBy` constraint on nested relations', async () => {
    createStore([{ model: User }, { model: Role }, { model: RoleUser }])

    await User.create({
      id: 1,
      roles: [{ id: 1 }, { id: 3 }, { id: 2 }]
    })

    const ascending = User.query()
      .with('roles', query => { query.orderBy('id', 'asc') })
      .find(1) as User

    expect(ascending.roles[0].id).toBe(1)
    expect(ascending.roles[1].id).toBe(2)
    expect(ascending.roles[2].id).toBe(3)

    const descending = User.query()
      .with('roles', query => { query.orderBy('id', 'desc') })
      .find(1) as User

    expect(descending.roles[0].id).toBe(3)
    expect(descending.roles[1].id).toBe(2)
    expect(descending.roles[2].id).toBe(1)
  })
})
