
import {
  createStore, createState
} from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Model – Inheritance - CRUD', () => {
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
        ADULT: Adult,
        PERSON: Person,
        SUPER: SuperAdult,
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

  class SuperAdult extends Adult {
    static entity = 'superadult'

    static baseEntity = 'person'

    static fields () {
      return {
        ...super.fields(),
        extra: this.attr('')
      }
    }
  }

  /// Tests
  it('can get mixed results when calling getter of root entity', () => {
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

    const results = Person.query().orderBy('id').get()
    expect(results.length).toBe(2)

    expect(results[0].name).toBe('John')
    expect(results[0]).toBeInstanceOf(Person)
    expect(results[0]).not.toBeInstanceOf(Adult)

    expect(results[1].name).toBe('Jane')
    expect(results[1]).toBeInstanceOf(Adult)
  })

  it('can get derived results only when calling getter of derived entity', () => {
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

    const results = Adult.all()
    expect(results.length).toBe(1)

    expect(results[0].name).toBe('Jane')
    expect(results[0]).toBeInstanceOf(Adult)
  })

  it('should clean only corresponding entities (and derived ones) when calling create', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }, {
      model: SuperAdult
    }, {
      model: Child
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'A',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'B',
        type: 'ADULT'
      }, {
        id: 3,
        name: 'C',
        type: 'SUPER'
      }, {
        id: 4,
        name: 'D',
        type: 'CHILD'
      }]
    })

    const persons = Person.all()
    expect(persons.length).toBe(4)

    store.dispatch('entities/adult/create', {
      data: [{
        id: 5,
        name: 'E'
      }]
    })

    const persons2 = Person.all()
    expect(persons2.length).toBe(3)

    const adults = Adult.all()
    expect(adults.length).toBe(1)
    expect(adults[0].id).toBe(5)
  })

  it('should update derived data without changing its class when calling base update', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'A',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'B',
        type: 'ADULT'
      }]
    })

    const adult = Person.find(2)
    expect(adult.name).toBe('B')

    Person.update({
      where: 2,
      data: { name: 'C' }
    })

    const newAdult = Person.find(2)
    expect(newAdult.name).toBe('C')
    expect(newAdult).toBeInstanceOf(Adult)
  })

  it('should update data with a closure using instanceof', async () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'A',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'B',
        type: 'ADULT'
      }]
    })

    const adult = Person.find(2)
    expect(adult.name).toBe('B')

    await Person.update({
      where: (record) => {
        return record instanceof Adult
      },
      data: { name: 'C' }
    })

    const newAdult = Person.find(2)
    expect(newAdult.name).toBe('C')
    expect(newAdult).toBeInstanceOf(Adult)
  })

  it('should update or insert mixed data', async () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    await Person.create({
      data: { id: 1, name: 'John Doe', job: 'Software Engineer', type: 'ADULT' }
    })

    await Person.insertOrUpdate({
      data: [
        { id: 1, name: 'John Doe', job: 'Writer', type: 'ADULT' },
        { id: 2, name: 'Jane Doe', job: 'QA', type: 'ADULT' },
        { id: 3, name: 'Jane Doe', type: 'PERSON' }
      ]
    })

    // await Person.update({
    //   where: 1,

    //   data (record) {
    //     record.job = 'Writer'
    //   }
    // })

    const expected = createState({
      person: {
        1: { $id: 1, id: 1, name: 'John Doe', job: 'Writer' },
        2: { $id: 2, id: 2, name: 'Jane Doe', job: 'QA' },
        3: { $id: 3, id: 3, name: 'Jane Doe' }
      },
      adult: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('should update only derived data when field is a derived entity field', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'A',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'B',
        job: 'Software Engineer',
        type: 'ADULT'
      }]
    })

    const adult = Person.find(2)
    expect(adult.name).toBe('B')

    Person.update({
      where: (record) => {
        return record instanceof Person
      },
      data: { job: 'Writer' }
    })

    const newAdult = Person.find(2)
    expect(newAdult.job).toBe('Writer')

    const person = Person.find(1)
    expect(person.job).toBe(undefined)
  })

  it('should delete record correctly when manipulating a derived entity', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'A',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'B',
        type: 'ADULT'
      }]
    })

    const persons = Person.all()
    expect(persons.length).toBe(2)

    Adult.delete(2)

    const persons2 = Person.all()
    expect(persons2.length).toBe(1)
    expect(persons2[0].id).toBe(1)
  })

  it('should delete only derived records when calling deleteAll on derived entity', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'A',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'B',
        type: 'ADULT'
      }]
    })

    const persons = Person.all()
    expect(persons.length).toBe(2)

    Adult.deleteAll()

    const persons2 = Person.all()
    expect(persons2.length).toBe(1)
    expect(persons2[0].id).toBe(1)
  })

  it('should delete only derived records (and their subtypes) when calling deleteAll on derived entity', () => {
    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }, {
      model: SuperAdult
    }])

    store.dispatch('entities/person/create', {
      data: [{
        id: 1,
        name: 'A',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'B',
        type: 'ADULT'
      }, {
        id: 3,
        name: 'C',
        type: 'SUPER'
      }]
    })

    const persons = Person.all()
    expect(persons.length).toBe(3)

    Adult.deleteAll()

    const persons2 = Person.all()
    expect(persons2.length).toBe(1)
    expect(persons2[0].id).toBe(1)
  })
})
