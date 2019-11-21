import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Query from 'app/query/Query'

describe('Unit – Query', () => {
  class User extends Model {
    static entity = 'users'
  }

  class Post extends Model {
    static entity = 'posts'
  }

  it('can retrieve all models from the database instance', () => {
    createStore([{ model: User }, { model: Post }])

    const models = (new Query({}, 'users')).getModels()

    expect(models.users).toBe(User)
    expect(models.posts).toBe(Post)
  })

  it('can retrieve a specific model from the database instance', () => {
    createStore([{ model: User }, { model: Post }])

    const model = (new Query({}, 'users')).getModel('posts')

    expect(model).toBe(Post)
  })

  it('retrieves the model correspondes to the entity of Query if the name is not specified', () => {
    createStore([{ model: User }, { model: Post }])

    const model = (new Query({}, 'users')).getModel()

    expect(model).toBe(User)
  })
})
