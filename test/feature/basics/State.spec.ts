import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Basics – State', () => {
  it('can define state at the model', () => {
    class User extends Model {
      static entity = 'users'

      static state = {
        fetching: false
      }

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    expect(store.state.entities.users.fetching).toBe(false)
  })

  it('can define state at the model as a function', () => {
    class User extends Model {
      static entity = 'users'

      static state() {
        return {
          fetching: false
        }
      }

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    expect(store.state.entities.users.fetching).toBe(false)
  })

  it('can mutate the state from the model', () => {
    class User extends Model {
      static entity = 'users'

      static state = {
        fetching: false
      }

      static fields() {
        return {
          id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }])

    User.commit((state) => {
      state.fetching = true
    })

    expect(store.state.entities.users.fetching).toBe(true)
  })

  it('can access model instance within mutation handler', () => {
    class User extends Model {
      static entity = 'users'

      static state = {
        fetching: false
      }

      static fields() {
        return {
          id: this.attr(null)
        }
      }

      static fetching(state: any) {
        state.fetching = true
      }
    }

    const store = createStore([{ model: User }])

    User.commit((state) => {
      User.fetching(state)
    })

    expect(store.state.entities.users.fetching).toBe(true)
  })
})
