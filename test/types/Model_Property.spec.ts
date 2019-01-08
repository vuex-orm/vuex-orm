import Model from 'src/model/Model'
import Fields from 'src/model/Fields'

class Person extends Model {
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

class Option extends Model {
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

const foundPerson = Person.find(1)
console.log(foundPerson === null ? 'null' : foundPerson.name)

const queriedPerson = Person.query().with('options').get()
console.log(queriedPerson[0].id)
console.log(queriedPerson[0].options[0].name)

const firstOption = Option.query().where('id', 1).first()
console.log(firstOption === null ? 'null' : firstOption.name)

const queriedOption = Option.query().where('id', 1).get()
console.log(queriedOption[0].person.name)
