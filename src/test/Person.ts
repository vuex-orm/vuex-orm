import { Fields, Model } from '../index'
import Option from './Option'

export default class Person extends Model {
  static entity = 'persons'

  static fields (): Fields {
    return {
      id: this.number(0),
      name: this.string(''),
      note: this.string('').nullable(),
      options: this.hasMany(Option, 'personId')
    }
  }

  id!: number
  name!: string
  note?: string
  options!: Option[]
}
