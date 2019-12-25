import Model from 'app/model/Model'

describe('Unit – Model', () => {
  it('can fetch empty fields when model fields is not declared', () => {
    class User extends Model {
      static entity = 'users'
    }

    expect(User.fields()).toEqual({})
  })

  it('should set default field values as a property on instantiation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    const user = new User()

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
  })

  it('should set default field values using a closure', () => {
    let counter = 0

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(() => counter++)
        }
      }
    }

    const user1 = new User()
    const user2 = new User()

    expect(user1.id).toBe(0)
    expect(user2.id).toBe(1)
  })

  it('should set given field values as a property on instantiation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    const user = new User({ name: 'Jane Doe', age: 32 })

    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.age).toBe(undefined)
  })

  it('can get a value of the primary key', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const data = { id: 1 }

    expect(User.getIndexIdFromRecord(data)).toBe('1')
  })

  it('can get a value of the composite primary key', () => {
    class Vote extends Model {
      static primaryKey = ['vote_id', 'user_id']

      static fields () {
        return {
          vote_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const data = { user_id: 1, vote_id: 2 }

    expect(Vote.getIndexIdFromRecord(data)).toBe('[2,1]')
  })

  it('can get local key of the model', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['name', 'email']

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    expect(User.localKey()).toBe('id')
  })

  // it('should return right model when getting a model from a record if the record is in a hierarchy', () => {
  //   class User extends Model {
  //     static entity = 'users'

  //     static typeKey = 'type'

  //     static types () {
  //       return {
  //         USER: User,
  //         SUPER: SuperUser
  //       }
  //     }
  //   }

  //   class SuperUser extends User {
  //     static entity = 'super_users'

  //     static baseEntity = 'users'
  //   }

  //   const result1 = User.getModelFromRecord({ type: 'USER' })

  //   expect(result1.prototype).toBeInstanceOf(User)

  //   const result2 = User.getModelFromRecord({ type: 'SUPER' })

  //   expect(result2.prototype).toBeInstanceOf(SuperUser)
  // })

  it('should return null when getting a model from a record if model was not found', () => {
    class User extends Model {
      static entity = 'users'

      static typeKey = 'type'

      static types () {
        return {
          USER: User,
          SUPER: SuperUser
        }
      }
    }

    class SuperUser extends User {
      static entity = 'superusers'

      static baseEntity = 'users'
    }

    const result1 = User.getModelFromRecord({ type: 'UNKNOWN' })

    expect(result1).toBe(null)

    const result2 = User.getModelFromRecord({ data: 'bla' })

    expect(result2).toBe(null)
  })

  it('should return model when getting a model from a record if the record is already a model instance', () => {
    class User extends Model {
      static entity = 'users'
    }

    const user = new User()

    const result = User.getModelFromRecord(user)

    expect(result).toBe(User)
  })

  it('throws error when trying to fetch attribute class that does not exist', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    expect(() => { User.getAttributeClass('blah') }).toThrow()
  })

  it('can hydrate given record', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('Default Doe')
        }
      }
    }

    const record = User.hydrate({ id: 1, age: 24 })

    expect(record).toEqual({ $id: null, id: 1, name: 'Default Doe' })
  })

  it('can hydrate without passing any record', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('Default Doe')
        }
      }
    }

    const record = User.hydrate()

    expect(record).toEqual({ $id: null, id: null, name: 'Default Doe' })
  })

  it('can hydrate relationship data', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id'),
          posts: this.hasMany(Post, 'user_id')
        }
      }
    }

    class Phone extends Model {
      static entity = 'phones'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          number: this.attr('12-3456-7891')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          title: this.attr('Default Title')
        }
      }
    }

    const record = User.hydrate({
      id: 1,
      phone: { id: 1 },
      posts: [{ id: 1, title: 'Title 001' }, { id: 2 }]
    })

    const expected = {
      $id: null,
      id: 1,
      phone: { $id: null, id: 1, user_id: null, number: '12-3456-7891' },
      posts: [
        { $id: null, id: 1, user_id: null, title: 'Title 001' },
        { $id: null, id: 2, user_id: null, title: 'Default Title' }
      ]
    }

    expect(record).toEqual(expected)
  })
})
