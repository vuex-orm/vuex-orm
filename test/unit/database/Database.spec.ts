import { createStoreFromDatabase } from 'test/support/Helpers'
import Database from 'app/database/Database'
import HackedDatabase from 'app/database/HackedDatabase'
import Model from 'app/model/Model'

describe('Unit – Database', () => {
  it('can fetch all models', () => {
    class User extends Model { static entity = 'users' }
    class Post extends Model { static entity = 'posts' }

    const database = new Database()

    database.register(User)
    database.register(Post)

    const models = database.models()

    expect(models.users).toBe(User)
    expect(models.posts).toBe(Post)
  })

  it('can fetch a model by string', () => {
    class User extends Model { static entity = 'users' }
    class Post extends Model { static entity = 'posts' }

    const database = new Database()

    database.register(User)
    database.register(Post)

    const model = database.model('users')

    expect(model).toBe(User)
  })

  it('can fetch a model by type', () => {
    class User extends Model { static entity = 'users' }
    class Post extends Model { static entity = 'posts' }

    const database = new Database()

    database.register(User)
    database.register(Post)

    const model = database.model(User)

    expect(model).toBe(User)
  })

  it('throws when a model is not found', () => {
    class User extends Model { static entity = 'users' }

    const database = new Database()

    database.register(User)

    expect(() => database.model('posts')).toThrowError('[Vuex ORM]')
  })

  it('can fetch all base models', () => {
    // Suppress model inheritance warning.
    jest.spyOn(global.console, 'warn').mockImplementation()

    class User extends Model { static entity = 'users' }
    class Guest extends Model { static entity = 'guests'; static baseEntity = 'users' }
    class Admin extends Model { static entity = 'admins'; static baseEntity = 'users' }

    const database = new Database()

    database.register(User)
    database.register(Guest)
    database.register(Admin)

    const models = database.baseModels()

    expect(models.users).toBe(User)
    expect(models.guests).toBe(User)
    expect(models.admins).toBe(User)
  })

  it('can fetch a base model by string', () => {
    // Suppress model inheritance warning.
    jest.spyOn(global.console, 'warn').mockImplementation()

    class User extends Model { static entity = 'users' }
    class Guest extends Model { static entity = 'guests'; static baseEntity = 'users' }

    const database = new Database()

    database.register(User)
    database.register(Guest)

    const model = database.baseModel('guests')

    expect(model).toBe(User)
  })

  it('can fetch a base model by type', () => {
    // Suppress model inheritance warning.
    jest.spyOn(global.console, 'warn').mockImplementation()

    class User extends Model { static entity = 'users' }
    class Guest extends Model { static entity = 'guests'; static baseEntity = 'users' }

    const database = new Database()

    database.register(User)
    database.register(Guest)

    const model = database.baseModel(Guest)

    expect(model).toBe(User)
  })

  it('throws when a base model is not found', () => {
    // Suppress model inheritance warning.
    jest.spyOn(global.console, 'warn').mockImplementation()

    class User extends Model { static entity = 'users' }
    class Guest extends Model { static entity = 'guests'; static baseEntity = 'users' }

    const database = new Database()

    database.register(User)
    database.register(Guest)

    expect(() => database.baseModel('admins')).toThrowError('[Vuex ORM]')
  })

  it('can fetch all modules', () => {
    class User extends Model { static entity = 'users' }
    class Post extends Model { static entity = 'posts' }

    const users = {}
    const posts = {}

    const database = new Database()

    database.register(User, users)
    database.register(Post, posts)

    const modules = database.modules()

    expect(modules.users).toBe(users)
    expect(modules.posts).toBe(posts)
  })

  it('can fetch a module', () => {
    class User extends Model { static entity = 'users' }
    class Post extends Model { static entity = 'posts' }

    const users = {}
    const posts = {}

    const database = new Database()

    database.register(User, users)
    database.register(Post, posts)

    const module = database.module('users')

    expect(module).toBe(users)
  })

  it('throws when a module is not found', () => {
    class User extends Model { static entity = 'users' }

    const users = {}

    const database = new Database()

    database.register(User, users)

    expect(() => database.module('posts')).toThrowError('[Vuex ORM]')
  })

  it('registers a hacked database to the store instance', () => {
    const database = new Database()

    const store = createStoreFromDatabase(database)

    expect(store.$db()).toBeInstanceOf(HackedDatabase)
  })

  it('binds the store instance to the registered models.', () => {
    class User extends Model { static entity = 'users' }

    const database1 = new Database()
    const database2 = new Database()

    database1.register(User)
    database2.register(User)

    const store1 = createStoreFromDatabase(database1)
    const store2 = createStoreFromDatabase(database2)

    expect(store1.$db().model('users').database()).toBe(database1)
    expect(store2.$db().model('users').database()).toBe(database2)

    expect(store1.$db().model(User)).not.toBe(User)
  })
})
