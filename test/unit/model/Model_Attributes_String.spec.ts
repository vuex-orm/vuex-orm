import Model from '@/model/Model'

describe('Feature – Attributes – String', () => {
  it('casts the value to `String` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: string | number

      // @Str('default')
      str!: string

      static fields() {
        return {
          id: this.attr(null),
          str: this.string('default')
        }
      }
    }

    expect(new User({}).str).toBe('default')
    expect(new User({ str: 'value' }).str).toBe('value')
    expect(new User({ str: 1 }).str).toBe('1')
    expect(new User({ str: true }).str).toBe('true')
    expect(new User({ str: null }).str).toBe('null')
  })

  it('can mutate the value by specifying mutator at attribute', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: string | number

      // @Str('default', { mutator: (value: any) => `${value} mutated` })
      str!: string

      static fields() {
        return {
          id: this.attr(null),
          str: this.string('default', (value: any) => `${value} mutated`)
        }
      }
    }

    expect(new User({}).str).toBe('default mutated')
    expect(new User({ str: 'value' }).str).toBe('value mutated')
    expect(new User({ str: 1 }).str).toBe('1 mutated')
    expect(new User({ str: true }).str).toBe('true mutated')
    expect(new User({ str: null }).str).toBe('null mutated')
  })

  it('can mutate the value by specifying mutator at mutators', () => {
    class User extends Model {
      static entity = 'users'

      // @Attribute
      id!: string | number

      // @Str('default')
      str!: string

      static fields() {
        return {
          id: this.attr(null),
          str: this.string('default')
        }
      }

      static mutators() {
        return {
          str(value: any) {
            return `${value} mutated`
          }
        }
      }
    }

    expect(new User({}).str).toBe('default mutated')
    expect(new User({ str: 'value' }).str).toBe('value mutated')
    expect(new User({ str: 1 }).str).toBe('1 mutated')
    expect(new User({ str: true }).str).toBe('true mutated')
    expect(new User({ str: null }).str).toBe('null mutated')
  })
})
