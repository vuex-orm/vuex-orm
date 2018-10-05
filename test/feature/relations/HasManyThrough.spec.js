import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Features – Relations – Has Many Through', () => {
  it('can create data contains has many through relationship', () => {
    class Country extends Model {
      static entity = 'countries'

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          country_id: this.attr(null)
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

    const store = createStore([{ model: Country }, { model: User }, { model: Post }])

    const data = {
      id: 1,
      posts: [
        { id: 1 },
        { id: 2 }
      ]
    }

    const expected = createState({
      countries: {
        '1': { $id: 1, id: 1, posts: [] }
      },
      posts: {
        '1': { $id: 1, id: 1, user_id: null },
        '2': { $id: 2, id: 2, user_id: null }
      },
      users: {}
    })

    store.dispatch('entities/countries/create', { data })

    expect(store.state.entities).toEqual(expected)
  })

  it('can resolve has many through relationship', async () => {
    class Country extends Model {
      static entity = 'countries'

      static fields () {
        return {
          id: this.attr(null),
          posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          country_id: this.attr(null)
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

    const store = createStore([{ model: Country }, { model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 1, country_id: 1 },
        { id: 2, country_id: 1 },
        { id: 3, country_id: 2 }
      ]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 1, user_id: 1 },
        { id: 2, user_id: 2 },
        { id: 3, user_id: 3 },
        { id: 4, user_id: 1 }
      ]
    })

    await store.dispatch('entities/countries/create', {
      data: [
        { id: 1 },
        { id: 2 }
      ]
    })

    const country = store.getters['entities/countries/query']().with('posts').find(1)

    expect(country).toBeInstanceOf(Country)
    expect(country.posts.length).toBe(3)
    expect(country.posts[0]).toBeInstanceOf(Post)

    // user_id: 1
    expect(country.posts[0].user_id).toBe(1)
    expect(country.posts[1].user_id).toBe(1)
    expect(country.posts[0].id).toBe(1)
    expect(country.posts[1].id).toBe(4)

    // user_id: 2
    expect(country.posts[2].user_id).toBe(2)
    expect(country.posts[2].id).toBe(2)
  })

  it('can resolve has many through relationship with custom primary keys', async () => {
    class Country extends Model {
      static entity = 'countries'

      static primaryKey = 'c_id'

      static fields () {
        return {
          c_id: this.attr(null),
          posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'u_id'

      static fields () {
        return {
          u_id: this.attr(null),
          country_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static primaryKey = 'p_id'

      static fields () {
        return {
          p_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Country }, { model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [
        { u_id: 1, country_id: 1 },
        { u_id: 2, country_id: 1 },
        { u_id: 3, country_id: 2 }
      ]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { p_id: 1, user_id: 1 },
        { p_id: 2, user_id: 2 },
        { p_id: 3, user_id: 3 }
      ]
    })

    await store.dispatch('entities/countries/create', {
      data: [
        { c_id: 1 },
        { c_id: 2 }
      ]
    })

    const country = store.getters['entities/countries/query']().with('posts').find(1)

    expect(country).toBeInstanceOf(Country)
    expect(country.posts.length).toBe(2)
    expect(country.posts[0]).toBeInstanceOf(Post)
    expect(country.posts[0].p_id).toBe(1)
    expect(country.posts[1].p_id).toBe(2)
  })

  it('can resolve has many through relationship with custom local keys', async () => {
    class Country extends Model {
      static entity = 'countries'

      static fields () {
        return {
          id: this.attr(null),
          c_id: this.attr(null),
          posts: this.hasManyThrough(Post, User, 'country_id', 'user_id', 'c_id', 'u_id')
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          u_id: this.attr(null),
          country_id: this.attr(null)
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          p_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: Country }, { model: User }, { model: Post }])

    await store.dispatch('entities/users/create', {
      data: [
        { id: 11, u_id: 1, country_id: 1 },
        { id: 12, u_id: 2, country_id: 1 },
        { id: 13, u_id: 3, country_id: 2 }
      ]
    })

    await store.dispatch('entities/posts/create', {
      data: [
        { id: 11, p_id: 1, user_id: 1 },
        { id: 12, p_id: 2, user_id: 2 },
        { id: 13, p_id: 3, user_id: 3 }
      ]
    })

    await store.dispatch('entities/countries/create', {
      data: [
        { id: 11, c_id: 1 },
        { id: 12, c_id: 2 }
      ]
    })

    const country = store.getters['entities/countries/query']().with('posts').find(11)

    expect(country).toBeInstanceOf(Country)
    expect(country.posts.length).toBe(2)
    expect(country.posts[0]).toBeInstanceOf(Post)
    expect(country.posts[0].id).toBe(11)
    expect(country.posts[1].id).toBe(12)
  })
})
