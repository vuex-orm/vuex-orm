import {
  createStore
} from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Model – Inheritance - No type warning', () => {
  class Person extends Model {
    static entity = 'person'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  class Adult extends Person {
    static entity = 'adult'
    static baseEntity = 'person'

    static fields () {
      return {
        ...super.fields(),
        job: this.attr('')
      }
    }
  }

  it('should warn user that no type is defined', () => {
    // There is no real test here, this will always pass but is needed
    // for test coverage
    createStore([{
      model: Person
    }, {
      model: Adult
    }])
  })
})
