import Model from 'app/model/Model'

describe('Model – Relations – BelongsToMany', () => {
  it('can resolve belongs to many relation', () => {
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
          id: this.attr(null),
          role_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const data = {
      id: 1,
      roles: [{ id: 1 }, { id: 2 }]
    }

    const user = new User(data)

    expect(user.id).toBe(1)
    expect(user.roles[0]).toBeInstanceOf(Role)
    expect(user.roles[0].id).toBe(1)
    expect(user.roles[1].id).toBe(2)
  })
})
