import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Models – Save', () => {
  class User extends Model {
    static entity = 'users'

    // @Attribute
    id!: number

    // @Attribute('')
    name!: string

    // @HasMany(Post, 'user_id')
    posts!: Post[]

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
        posts: this.hasMany(Post, 'user_id')
      }
    }
  }

  class Post extends Model {
    static entity = 'posts'

    // @Attribute
    id!: number

    // @Attribute
    user_id!: number

    // @BelongsTo(User, 'user_id')
    user!: User

    static fields () {
      return {
        id: this.attr(null),
        user_id: this.attr(null),
        user: this.belongsTo(User, 'user_id')
      }
    }
  }

  it('can save a new record', async () => {
    const store = createStore([{ model: User }])

    const user = new User()
    user.id = 1
    user.name = 'John Doe'
    user.$save()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe', posts: [] }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can save a new record and ignore references', async () => {
    const store = createStore([{ model: User }, { model: Post }])

    const user = await new User()
    user.id = 1
    user.name = 'John Doe'
    user.$save()

    const post = await new Post()
    post.id = 1
    post.user_id = user.id
    post.user = user
    post.$save()

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'John Doe', posts: [] }
      },
      posts: {
        1: { $id: '1', id: 1, user_id: 1, user: null }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })
})
