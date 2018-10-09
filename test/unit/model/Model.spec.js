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

  it('should set given field values as a property on instanctiation', () => {
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

  it('should mutate data if closure was given to the attr when instantiating', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators are present', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('')
        }
      }

      static mutators () {
        return {
          name (value) {
            return value.toUpperCase()
          }
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })

  it('attr mutator should take precedent over static mutators', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }

      static mutators () {
        return {
          name (value) {
            return 'Not Expected'
          }
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
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

    expect(User.id(data)).toBe(1)
  })

  it('can get a value of the composit primary key', () => {
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

    expect(Vote.id(data)).toBe('2_1')
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

  it('can serialize own fields into json', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const user = new User({ $id: 1, id: 1, name: 'John Doe' })

    const json = user.$toJson()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({ id: 1, name: 'John Doe' })
  })

  it('can serialize nested fields into json', () => {
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
          user_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const user = new User({
      $id: 1,
      id: 1,
      phone: { $id: 2, id: 2, user_id: 1 },
      posts: [
        { $id: 3, id: 3, user_id: 1 },
        { $id: 4, id: 4, user_id: 1 }
      ]
    })

    const json = user.$toJson()

    const expected = {
      id: 1,
      phone: { id: 2, user_id: 1 },
      posts: [
        { id: 3, user_id: 1 },
        { id: 4, user_id: 1 }
      ]
    }

    expect(json).not.toBeInstanceOf(User)
    expect(json.phone).not.toBeInstanceOf(Phone)
    expect(json.posts[0]).not.toBeInstanceOf(Post)
    expect(json.posts[1]).not.toBeInstanceOf(Post)
    expect(json).toEqual(expected)
  })
})
