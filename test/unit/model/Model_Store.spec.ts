import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Model – Store', () => {
  it('can access the store instance as static method', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static find () {
        return this.store().getters[this.namespace('find')](1)
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const user = User.find()

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

  it('can access the store instance as instance method', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      create () {
        return this.$store().dispatch(this.$namespace('create'), {
          data: { id: 1, name: 'John Doe' }
        })
      }
    }

    const store = createStore([{ model: User }])

    ;(new User()).create()

    const user = store.getters['entities/users/find'](1)

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

  it('can dispatch an action as static method', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static create () {
        return this.dispatch('create', {
          data: { id: 1, name: 'John Doe' }
        })
      }
    }

    const store = createStore([{ model: User }])

    User.create()

    const user = store.getters['entities/users/find'](1)

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

  it('can dispatch an action as instance method', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      create () {
        return this.$dispatch('create', {
          data: { id: 1, name: 'John Doe' }
        })
      }
    }

    const store = createStore([{ model: User }])

    ;(new User()).create()

    const user = store.getters['entities/users/find'](1)

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

  it('can call getters as static method', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static find () {
        return this.getters('find')(1)
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const user = User.find()

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

  it('can call getters as instance method', async () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      find () {
        return this.$getters('find')(1)
      }
    }

    const store = createStore([{ model: User }])

    await store.dispatch('entities/users/create', {
      data: { id: 1, name: 'John Doe' }
    })

    const user = (new User()).find()

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })
})
