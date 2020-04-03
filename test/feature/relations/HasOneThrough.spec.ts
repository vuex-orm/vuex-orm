import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Features – Relations – Has One Through', () => {
  it('can create entities containing the relation', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute()
      id!: number

      // @HasOneThrough(Image, Profile, 'user_id', 'profile_id')
      image!: Image

      static fields() {
        return {
          id: this.attr(null),
          image: this.hasOneThrough(Image, Profile, 'user_id', 'profile_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      // @Attribute()
      id!: number

      // @Attribute()
      user_id!: number

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      // @Attribute()
      id!: number

      // @Attribute()
      profile_id!: number

      static fields() {
        return {
          id: this.attr(null),
          profile_id: this.attr(null)
        }
      }
    }

    const store = createStore([
      { model: User },
      { model: Profile },
      { model: Image }
    ])

    await User.insert({
      id: 1,
      image: { id: 1 }
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, image: null }
      },
      images: {
        1: { $id: '1', id: 1, profile_id: null }
      },
      profiles: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve the relation', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute()
      id!: number

      // @HasOneThrough(Image, Profile, 'user_id', 'profile_id')
      image!: Image

      static fields() {
        return {
          id: this.attr(null),
          image: this.hasOneThrough(Image, Profile, 'user_id', 'profile_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      // @Attribute()
      id!: number

      // @Attribute()
      user_id!: number

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      // @Attribute()
      id!: number

      // @Attribute()
      profile_id!: number

      static fields() {
        return {
          id: this.attr(null),
          profile_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Profile }, { model: Image }])

    await User.insert([{ id: 1 }, { id: 2 }])

    await Profile.insert([
      { id: 3, user_id: 1 },
      { id: 4, user_id: 2 }
    ])

    await Image.insert([
      { id: 5, profile_id: 3 },
      { id: 6, profile_id: 4 }
    ])

    const user = User.query()
      .with('image')
      .find(1) as User

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
    expect(user.image).toBeInstanceOf(Image)
    expect(user.image.profile_id).toBe(3)
    expect(user.image.id).toBe(5)
  })

  it('can resolve the relation with string value id', async () => {
    class User extends Model {
      static entity = 'users'

      // @Str('')
      id!: number

      // @HasOneThrough(Image, Profile, 'user_id', 'profile_id')
      image!: Image

      static fields() {
        return {
          id: this.string(''),
          image: this.hasOneThrough(Image, Profile, 'user_id', 'profile_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      // @Str('')
      id!: number

      // @Str('')
      user_id!: number

      static fields() {
        return {
          id: this.string(''),
          user_id: this.string('')
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      // @Str('')
      id!: number

      // @Str('')
      profile_id!: number

      static fields() {
        return {
          id: this.string(''),
          profile_id: this.string('')
        }
      }
    }

    createStore([{ model: User }, { model: Profile }, { model: Image }])

    await User.insert([{ id: 'string-id-1' }, { id: 'string-id-2' }])

    await Profile.insert([
      { id: 'string-id-3', user_id: 'string-id-1' },
      { id: 'string-id-4', user_id: 'string-id-2' }
    ])

    await Image.insert([
      { id: 'string-id-5', profile_id: 'string-id-3' },
      { id: 'string-id-6', profile_id: 'string-id-4' }
    ])

    const user = User.query()
      .with('image')
      .find('string-id-1') as User

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('string-id-1')
    expect(user.image).toBeInstanceOf(Image)
    expect(user.image.profile_id).toBe('string-id-3')
    expect(user.image.id).toBe('string-id-5')
  })

  it('can resolve the relation when the intermediate entity is empty', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute()
      id!: number

      // @HasOneThrough(Image, Profile, 'user_id', 'profile_id')
      image!: Image

      static fields() {
        return {
          id: this.attr(null),
          image: this.hasOneThrough(Image, Profile, 'user_id', 'profile_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      // @Attribute()
      id!: number

      // @Attribute()
      user_id!: number

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      // @Attribute()
      id!: number

      // @Attribute()
      profile_id!: number

      static fields() {
        return {
          id: this.attr(null),
          profile_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Profile }, { model: Image }])

    await User.insert([{ id: 1 }])

    const user = User.query()
      .with('image')
      .find(1) as User

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
    expect(user.image).toBeNull()
  })

  it('can resolve the relation when the target entity is empty', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute()
      id!: number

      // @HasOneThrough(Image, Profile, 'user_id', 'profile_id')
      image!: Image

      static fields() {
        return {
          id: this.attr(null),
          image: this.hasOneThrough(Image, Profile, 'user_id', 'profile_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      // @Attribute()
      id!: number

      // @Attribute()
      user_id!: number

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      // @Attribute()
      id!: number

      // @Attribute()
      profile_id!: number

      static fields() {
        return {
          id: this.attr(null),
          profile_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Profile }, { model: Image }])

    await User.insert({ id: 1 })

    await Profile.insert({
      id: 1,
      user_id: 1
    })

    const user = User.query()
      .with('image')
      .find(1) as User

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
    expect(user.image).toBeNull()
  })

  it('can resolve the relation with custom primary keys', async () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'u_id'

      // @Attribute()
      u_id!: number

      // @HasOneThrough(Image, Profile, 'user_id', 'profile_id')
      image!: Image

      static fields() {
        return {
          u_id: this.attr(null),
          image: this.hasOneThrough(Image, Profile, 'user_id', 'profile_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      static primaryKey = 'p_id'

      // @Attribute()
      p_id!: number

      // @Attribute()
      user_id!: number

      static fields() {
        return {
          p_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      static primaryKey = 'i_id'

      // @Attribute()
      i_id!: number

      // @Attribute()
      profile_id!: number

      static fields() {
        return {
          i_id: this.attr(null),
          profile_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Profile }, { model: Image }])

    await User.insert([{ u_id: 1 }, { u_id: 2 }])

    await Profile.insert([
      { p_id: 3, user_id: 1 },
      { p_id: 4, user_id: 2 }
    ])

    await Image.insert([
      { i_id: 5, profile_id: 3 },
      { i_id: 6, profile_id: 4 }
    ])

    const user = User.query()
      .with('image')
      .find(1) as User

    expect(user).toBeInstanceOf(User)
    expect(user.u_id).toBe(1)
    expect(user.image).toBeInstanceOf(Image)
    expect(user.image.profile_id).toBe(3)
    expect(user.image.i_id).toBe(5)
  })

  it('can resolve the relation with custom local keys', async () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute()
      id!: number

      // @Attribute()
      u_id!: number

      // @HasOneThrough(Image, Profile, 'user_id', 'profile_id', 'u_id', 'p_id')
      image!: Image

      static fields() {
        return {
          id: this.attr(null),
          u_id: this.attr(null),
          image: this.hasOneThrough(
            Image,
            Profile,
            'user_id',
            'profile_id',
            'u_id',
            'p_id'
          )
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      // @Attribute()
      id!: number

      // @Attribute()
      p_id!: number

      // @Attribute()
      user_id!: number

      static fields() {
        return {
          id: this.attr(null),
          p_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      // @Attribute()
      id!: number

      // @Attribute()
      i_id!: number

      // @Attribute()
      profile_id!: number

      static fields() {
        return {
          id: this.attr(null),
          i_id: this.attr(null),
          profile_id: this.attr(null)
        }
      }
    }

    createStore([{ model: User }, { model: Profile }, { model: Image }])

    await User.insert([
      { id: 11, u_id: 1 },
      { id: 12, u_id: 2 }
    ])

    await Profile.insert([
      { id: 13, p_id: 3, user_id: 1 },
      { id: 14, p_id: 4, user_id: 2 }
    ])

    await Image.insert([
      { id: 15, i_id: 5, profile_id: 3 },
      { id: 16, i_id: 6, profile_id: 4 }
    ])

    const user = User.query()
      .with('image')
      .find(11) as User

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(11)
    expect(user.image).toBeInstanceOf(Image)
    expect(user.image.profile_id).toBe(3)
    expect(user.image.id).toBe(15)
  })
})
