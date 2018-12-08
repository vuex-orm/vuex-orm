import Person from './Person'
import Option from './Option'

const foundPerson = Person.find(1)
console.log(foundPerson === null ? 'null' : foundPerson.name)

const queriedPerson = Person.query().with('options').get()
console.log(queriedPerson[0].id)
console.log(queriedPerson[0].options[0].name)

const firstOption = Option.query().where('id', 1).first()
console.log(firstOption === null ? 'null' : firstOption.name)

const queriedOption = Option.query().where('id', 1).get()
console.log(queriedOption[0].person.name)
