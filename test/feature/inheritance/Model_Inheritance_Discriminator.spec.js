import {
  createStore
} from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Model – Inheritance - Discriminator field', () => {
  it('uses default `type` field when no typeKey is defined', () => {
    class Person extends Model {
      static entity = 'person'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      static types () {
        return {
          'PERSON': Person,
          'ADULT': Adult
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'

      static fields () {
        return {}
      }
    }

    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/insert', {
      data: {
        id: 1,
        name: 'John Doe',
        type: 'ADULT'
      }
    })

    const adult = Adult.find(1)
    expect(adult).toBeInstanceOf(Adult)
  })

  it('uses overwritten typeKey as discriminator when defined', () => {
    class Person extends Model {
      static entity = 'person'
      static typeKey = 'the_key'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          the_key: this.attr('')
        }
      }

      static types () {
        return {
          'PERSON': Person,
          'ADULT': Adult
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'

      static fields () {
        return {}
      }
    }

    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/insert', {
      data: {
        id: 1,
        name: 'John Doe',
        the_key: 'ADULT'
      }
    })

    const adult = Adult.find(1)
    expect(adult).toBeInstanceOf(Adult)
  })

  it('dispatches mixed data and hydrates with the right models', () => {
    class Person extends Model {
      static entity = 'person'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          type: this.attr('')
        }
      }

      static types () {
        return {
          'PERSON': Person,
          'ADULT': Adult,
          'CHILD': Child
        }
      }
    }

    class Child extends Person {
      static entity = 'child'
      static baseEntity = 'person'

      static fields () {
        return {}
      }
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'

      static fields () {
        return {}
      }
    }

    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }, {
      model: Child
    }])

    store.dispatch('entities/person/insert', {
      data: [{
        id: 1,
        name: 'John Doe',
        type: 'ADULT'
      }, {
        id: 2,
        name: 'John Doe Jr',
        type: 'CHILD'
      }, {
        id: 3,
        name: 'Doe',
        type: 'PERSON'
      }, {
        id: 4,
        name: 'Jane Doe',
        type: 'ADULT'
      }]
    })

    const adults = Adult.all()
    expect(adults.length).toBe(2)

    const adult = adults[0]
    expect(adult).toBeInstanceOf(Adult)

    const children = Child.all()
    expect(children.length).toBe(1)

    const child = children[0]
    expect(child).toBeInstanceOf(Child)

    const persons = Person.all()
    expect(persons.length).toBe(4)
  })

  it('should set the right discriminator value if inserted through derived Query', () => {
    class Person extends Model {
      static entity = 'person'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          type: this.attr('')
        }
      }

      static types () {
        return {
          'PERSON': Person,
          'ADULT': Adult
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'

      static fields () {
        return {
          ...super.fields()
        }
      }
    }

    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    // Inserting using "adult" endpoint
    store.dispatch('entities/adult/create', {
      data: {
        id: 1,
        name: 'John Doe'
      }
    })

    const adult = Adult.find(1)
    expect(adult.type).toBe('ADULT')
  })

  it('should handle discriminator as Number', () => {
    class Person extends Model {
      static entity = 'person'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          type: this.number(0)
        }
      }

      static types () {
        return {
          0: Person,
          1: Adult
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'

      static fields () {
        return {
          ...super.fields()
        }
      }
    }

    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'John Doe',
        type: 1
      }, {
        id: 2,
        name: 'Person Doe',
        type: 0
      }]
    })

    const adult = Adult.find(1)
    expect(adult.name).toBe('John Doe')

    const person = Person.find(2)
    expect(person.name).toBe('Person Doe')
    expect(person.type).toBe(0)
  })
})
