import Model from 'app/Model'
import Database from 'app/Database'
import Container from 'app/connections/Container'
import VuexOrm from 'app'

class User extends Model {
  static entity = 'users'
}

class Post extends Model {
  static entity = 'posts'
}

const users = {}
const posts = {}

describe('Vuex ORM Installation', () => {
  it('can register its database to Vuex Store', () => {
    const registerModule = sinon.stub()
    const store = { registerModule }

    const database = new Database()

    database.register(User, users)
    database.register(Post, posts)

    VuexOrm.install(database)(store)

    expect(registerModule.withArgs('entities', database.modules('entities')).calledOnce).toBe(true)
  })

  it('lets user override the namespace', () => {
    const registerModule = sinon.stub()
    const store = { registerModule }

    const database = new Database()

    database.register(User, users)
    database.register(Post, posts)

    const options = { namespace: 'myNameSpace' }

    VuexOrm.install(database, options)(store)

    expect(registerModule.withArgs('myNameSpace', database.modules('myNameSpace')).calledOnce).toBe(true)
  })
})
