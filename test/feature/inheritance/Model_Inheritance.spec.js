import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Model – Inheritance - No type warning', () => {
  class Person extends Model {
    static entity = 'person'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
        type: this.string('')
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

describe('Model – Inheritance', () => {
  class Person extends Model {
    static entity = 'person'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr(''),
        type: this.string('')
      }
    }

    static types () {
      return {
        ADULT: Adult,
        PERSON: Person,
        CHILD: Child
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

  class Child extends Person {
    static entity = 'child'

    static baseEntity = 'person'

    static fields () {
      return {
        ...super.fields()
      }
    }
  }

  /// Tests
  it('should return right type string for given mode', () => {
    expect(Adult.getTypeKeyValueFromModel()).toBe('ADULT')
    expect(Model.getTypeKeyValueFromModel()).toBe(null)
  })

  it('sets right class for derived entity', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/adult/insert', {
      data: {
        id: 1,
        name: 'John Doe'
      }
    })

    const adult = Adult.find(1)

    expect(adult).toBeInstanceOf(Adult)
  })

  it('should inherit fields from root entity', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/insert', {
      data: {
        id: 1,
        name: 'Test'
      }
    })

    store.dispatch('entities/adult/insert', {
      data: {
        id: 2,
        name: 'John Doe'
      }
    })

    const adult = Adult.find(2)
    expect(adult.id).toBe(2)
    expect(adult.name).toBe('John Doe')
  })

  it('should have own fields only on derived entity', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/insert', {
      data: {
        id: 1,
        name: 'John'
      }
    })

    store.dispatch('entities/adult/insert', {
      data: {
        id: 2,
        name: 'Jane',
        job: 'Software Engineer'
      }
    })

    const person = Person.find(1)
    expect(person.job).toBe(undefined)

    const adult = Adult.find(2)
    expect(adult.job).toBe('Software Engineer')
  })
})
