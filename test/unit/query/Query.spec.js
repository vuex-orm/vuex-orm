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
    const store = createStore([{ model: User }, { model: Post }])

    const models = (new Query(store, 'users')).getModels()

    expect(models.users.prototype).toBeInstanceOf(User)
    expect(models.posts.prototype).toBeInstanceOf(Post)
  })

  it('can retrieve a specific model from the database instance', () => {
    const store = createStore([{ model: User }, { model: Post }])

    const model = (new Query(store, 'users')).getModel('posts')

    expect(model.prototype).toBeInstanceOf(Post)
  })

  it('retrieves the model correspondes to the entity of Query if the name is not specified', () => {
    const store = createStore([{ model: User }, { model: Post }])

    const model = (new Query(store, 'users')).getModel()

    expect(model.prototype).toBeInstanceOf(User)
  })
})
