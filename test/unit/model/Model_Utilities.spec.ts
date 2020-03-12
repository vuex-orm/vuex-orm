import Model from '@/model/Model'

describe('Unit – Model - Utilities', () => {
  it('can check if the key is primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'id'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    expect(User.isPrimaryKey('id')).toBe(true)
    expect(User.isPrimaryKey('name')).toBe(false)
  })

  it('can check if the key is primary key is included in composite primary key', () => {
    class Subscription extends Model {
      static entity = 'users'

      static primaryKey = ['user_id', 'video_id']

      static fields () {
        return {
          user_id: this.attr(null),
          video_id: this.attr(null),
          created_at: this.attr(null)
        }
      }
    }

    expect(Subscription.isPrimaryKey('user_id')).toBe(true)
    expect(Subscription.isPrimaryKey('video_id')).toBe(true)
    expect(Subscription.isPrimaryKey('created_at')).toBe(false)
  })

  it('can check if the primary key is a composite primary key', () => {
    class Subscription extends Model {
      static entity = 'users'

      static primaryKey = ['user_id', 'video_id']

      static fields () {
        return {
          user_id: this.attr(null),
          video_id: this.attr(null),
          created_at: this.attr(null)
        }
      }
    }

    expect(Subscription.isCompositePrimaryKey()).toBe(true)
  })

  it('can get primary key value out of record', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    expect(User.getIdFromRecord({ id: 1, name: 'John' })).toBe(1)
    expect(User.getIdFromRecord({ name: 'John' })).toBe(null)
  })

  it('can get composite primary key value out of record as an array ', () => {
    class Subscription extends Model {
      static entity = 'users'

      static primaryKey = ['user_id', 'video_id']

      static fields () {
        return {
          user_id: this.attr(null),
          video_id: this.attr(null),
          created_at: this.attr(null)
        }
      }
    }

    expect(Subscription.getIdFromRecord({ user_id: 1, video_id: 2 })).toEqual([1, 2])
    expect(Subscription.getIdFromRecord({ created_at: '1985-10-10 12:00:00' })).toBe(null)
  })
})
