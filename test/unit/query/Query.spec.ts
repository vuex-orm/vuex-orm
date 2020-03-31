import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'
import Query from '@/query/Query'

describe('Unit – Query', () => {
  class User extends Model {
    static entity = 'users'
  }

  class Post extends Model {
    static entity = 'posts'
  }

  it('can retrieve all models from the database instance', () => {
    const store = createStore([{ model: User }, { model: Post }])

    const models = (new Query(store, 'users')).getModels()

    expect(models.users).toBe(User)
    expect(models.posts).toBe(Post)
  })

  it('can retrieve a specific model from the database instance', () => {
    const store = createStore([{ model: User }, { model: Post }])

    const model = (new Query(store, 'users')).getModel('posts')

    expect(model).toBe(Post)
  })

  it('retrieves the model corresponds to the entity of Query if the name is not specified', () => {
    const store = createStore([{ model: User }, { model: Post }])

    const model = (new Query(store, 'users')).getModel()

    expect(model).toBe(User)
  })
})
