import { Fields, Model } from '../index'
import Person from './Person'

export default class Option extends Model {
  static entity = 'persons'

  static fields (): Fields {
    return {
      id: this.number(0),
      name: this.string(''),
      personId: this.number(0),
      person: this.belongsTo(Person, 'personId')
    }
  }

  id!: number
  name!: string
  personId!: number
  person!: Person
}
