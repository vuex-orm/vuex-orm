import Model from '@/model/Model'

describe('Unit – Model - Serialization', () => {
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

    const user = new User({ id: 1, name: 'John Doe' })

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
      id: 1,
      phone: { id: 2, user_id: 1 },
      posts: [
        { id: 3, user_id: 1 },
        { id: 4, user_id: 1 }
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

  it('can serialize empty relation into json', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          phone: this.hasOne(Phone, 'user_id')
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

    const user = new User({ id: 1 })

    const json = user.$toJson()

    const expected = { id: 1, phone: null }

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual(expected)
  })

  it('can serialize the array field', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          array: this.attr([])
        }
      }
    }

    const user = new User({ id: 1, array: [1, 2] })

    const json = user.$toJson()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({ id: 1, array: [1, 2] })
  })
})
