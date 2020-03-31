import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Performance – Retrieve – Belongs To Many', () => {
  it('should retrieve belongsToMany relation in time', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields() {
        return {
          id: this.attr(null),
          roleType: this.attr('')
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      static fields() {
        return {
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const users = []
    const roles = []
    const roleUser = []

    for (let i = 1; i <= 2000; i++) {
      users.push({ id: i })
    }

    for (let i = 1; i <= 2000; i++) {
      roles.push({ id: i })
    }

    for (let i = 1; i <= 2000; i++) {
      roleUser.push({ user_id: i, role_id: i })
    }

    const store = createStore([
      { model: User },
      { model: Role },
      { model: RoleUser }
    ])

    await store.dispatch('entities/users/create', { data: users })
    await store.dispatch('entities/roles/create', { data: roles })
    await store.dispatch('entities/roleUser/create', { data: roleUser })

    const start = +new Date()

    store.getters['entities/users/query']()
      .with('roles')
      .get()

    const end = +new Date()

    expect(end - start).toBeLessThan(300)
    console.info('\x1b[2m%s\x1b[0m', `    -- The test took ${end - start}ms`)
  })
})
