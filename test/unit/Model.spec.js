import { createApplication } from 'test/support/Helpers'
import Model from 'app/Model'

describe('Model', () => {
  it('should set default field values as a property on instanciation', () => {
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

  it('should set given field values as a property on instanciation', () => {
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

  it('can serialize own fields into json', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John Doe')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          post_id: this.attr(null),
          body: this.attr('')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          user_id: this.attr(null),
          title: this.attr(''),
          author: this.belongsTo(User, 'user_id'),
          comments: this.hasMany(Comment, 'post_id')
        }
      }
    }

    const data = {
      id: 1,
      title: 'Post Title',
      user_id: 1,
      author: { id: 1, name: 'John' },
      comments: [
        { id: 1, post_id: 1, body: 'C1' },
        { id: 2, post_id: 1, body: 'C2' }
      ]
    }

    const post = new Post(data)

    expect(post.$toJson()).toEqual(data)
  })

  it('can get a `increment` field from the schema', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.increment()
        }
      }
    }

    expect(User.incrementFields()).toEqual([{
      id: User.increment()
    }])
  })

  it('can check if the fields has `increment` fields', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.increment()
        }
      }
    }

    expect(User.hasIncrementFields()).toBe(true)
  })
})
