import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Performance – Retrieve – Has One Through', () => {
  it('should retrieve relation in time', async () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(null),
          image: this.hasOneThrough(Image, Profile, 'user_id', 'profile_id')
        }
      }
    }

    class Profile extends Model {
      static entity = 'profiles'

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    class Image extends Model {
      static entity = 'images'

      static fields() {
        return {
          id: this.attr(null),
          profile_id: this.attr(null)
        }
      }
    }

    const users = []
    const profiles = []
    const images = []

    for (let i = 1; i <= 1000; i++) {
      users.push({ id: i })
    }

    for (let i = 1; i <= 1000; i++) {
      profiles.push({ id: i, user_id: i })
    }

    for (let i = 1; i <= 1000; i++) {
      images.push({ id: i, profile_id: i })
    }

    const store = createStore([
      { model: User },
      { model: Profile },
      { model: Image }
    ])

    await store.dispatch('entities/users/create', { data: users })
    await store.dispatch('entities/profiles/create', { data: profiles })
    await store.dispatch('entities/images/create', { data: images })

    const start = +new Date()

    store.getters['entities/users/query']()
      .with('image')
      .get()

    const end = +new Date()

    expect(end - start).toBeLessThan(300)
    console.info('\x1b[2m%s\x1b[0m', `    -- The test took ${end - start}ms`)
  })
})
