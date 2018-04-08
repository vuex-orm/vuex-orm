import Model from 'app/model/Model'

describe('Feature – Attributes – Boolean', () => {
  it('casts the value to `Boolean` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          bool: this.boolean(true)
        }
      }
    }

    expect(new User({ id: 1 }).bool).toBe(true)
    expect(new User({ id: 2, bool: '' }).bool).toBe(false)
    expect(new User({ id: 3, bool: 'string' }).bool).toBe(true)
    expect(new User({ id: 4, bool: '0' }).bool).toBe(false)
    expect(new User({ id: 5, bool: 0 }).bool).toBe(false)
    expect(new User({ id: 6, bool: 1 }).bool).toBe(true)
    expect(new User({ id: 7, bool: true }).bool).toBe(true)
    expect(new User({ id: 8, bool: null }).bool).toBe(false)
  })

  it('can mutate the value by specifying mutator at attribute', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          bool: this.boolean(true, value => !value)
        }
      }
    }

    expect(new User({ id: 1 }).bool).toBe(false)
    expect(new User({ id: 2, bool: '' }).bool).toBe(true)
    expect(new User({ id: 3, bool: 'string' }).bool).toBe(false)
    expect(new User({ id: 4, bool: '0' }).bool).toBe(true)
    expect(new User({ id: 5, bool: 0 }).bool).toBe(true)
    expect(new User({ id: 6, bool: 1 }).bool).toBe(false)
    expect(new User({ id: 7, bool: true }).bool).toBe(false)
    expect(new User({ id: 8, bool: null }).bool).toBe(true)
  })

  it('can mutate the value by specifying mutator at mutators', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          bool: this.boolean(true)
        }
      }

      static mutators () {
        return {
          bool (value) {
            return !value
          }
        }
      }
    }

    expect(new User({ id: 1 }).bool).toBe(false)
    expect(new User({ id: 2, bool: '' }).bool).toBe(true)
    expect(new User({ id: 3, bool: 'string' }).bool).toBe(false)
    expect(new User({ id: 4, bool: '0' }).bool).toBe(true)
    expect(new User({ id: 5, bool: 0 }).bool).toBe(true)
    expect(new User({ id: 6, bool: 1 }).bool).toBe(false)
    expect(new User({ id: 7, bool: true }).bool).toBe(false)
    expect(new User({ id: 8, bool: null }).bool).toBe(true)
  })
})
