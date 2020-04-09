import { Num } from '@/model/decorators/attributes/types/Num'
import { Model } from '@/model/Model'

describe('unit/model/Model_Attrs_Number', () => {
  it('casts the value to `Number` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0)
      num!: number
    }

    expect(new User({}).num).toBe(0)
    expect(new User({ num: 1 }).num).toBe(1)
    expect(new User({ num: '2' }).num).toBe(2)
    expect(new User({ num: true }).num).toBe(1)
    expect(new User({ num: false }).num).toBe(0)
    expect(new User({ num: null }).num).toBe(0)
  })

  it('accepts `null` when the `nullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Num(null, { nullable: true })
      num!: number | null
    }

    expect(new User({}).num).toBe(null)
    expect(new User({ num: 1 }).num).toBe(1)
    expect(new User({ num: '2' }).num).toBe(2)
    expect(new User({ num: true }).num).toBe(1)
    expect(new User({ num: false }).num).toBe(0)
    expect(new User({ num: null }).num).toBe(null)
  })
})
