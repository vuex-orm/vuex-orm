import Model from 'app/model/Model'

describe('Unit – Model', () => {
  it('should mutate data if closure was given to the attr when instantiating', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators are present', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('')
        }
      }

      static mutators () {
        return {
          name (value) {
            return value.toUpperCase()
          }
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })

  it('attr mutator should take precedent over static mutators', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }

      static mutators () {
        return {
          name (value) {
            return 'Not Expected'
          }
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })
})
