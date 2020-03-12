import Model from '@/model/Model'

describe('Unit – Model', () => {
  it('should mutate data if closure was given to the attr when instantiating', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute('', { mutator: (value: any) => value.toUpperCase() })
      name!: string

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }
    }

    expect(new User({ name: 'john doe' }).name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators are present', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute('')
      name!: string

      static fields () {
        return {
          name: this.attr('')
        }
      }

      static mutators () {
        return {
          name (value: any) {
            return value.toUpperCase()
          }
        }
      }
    }

    expect(new User({ name: 'john doe' }).name).toBe('JOHN DOE')
  })

  it('attr mutator should take precedence over static mutators', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute('', { mutator: (value: any) => value.toUpperCase() })
      name!: string

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }

      static mutators () {
        return {
          name (_value: any) {
            return 'Not Expected'
          }
        }
      }
    }

    expect(new User({ name: 'john doe' }).name).toBe('JOHN DOE')
  })
})
