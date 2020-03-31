import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature - Inheritance - CRUD', () => {
  class Person extends Model {
    static entity = 'person'

    static types() {
      return {
        ADULT: Adult,
        PERSON: Person,
        CHILD: Child
      }
    }

    static fields() {
      return {
        id: this.attr(null),
        name: this.attr(''),
        type: this.string('')
      }
    }

    id!: any
    name!: any
    type!: string
  }

  class Adult extends Person {
    static entity = 'adult'

    static baseEntity = 'person'

    static fields() {
      return {
        ...super.fields(),
        job: this.attr('')
      }
    }

    job!: any
  }

  class Child extends Person {
    static entity = 'child'

    static baseEntity = 'person'

    static fields() {
      return {
        ...super.fields()
      }
    }
  }

  it('can get mixed results when calling getter of root entity', async () => {
    createStore([Person, Adult])

    await Person.insert({ id: 1, name: 'John' })

    await Adult.insert({ id: 2, name: 'Jane', job: 'Software Engineer' })

    const people = Person.query()
      .orderBy('id')
      .get()

    expect(people.length).toBe(2)

    expect(people[0].name).toBe('John')
    expect(people[0]).toBeInstanceOf(Person)
    expect(people[0]).not.toBeInstanceOf(Adult)

    expect(people[1].name).toBe('Jane')
    expect(people[1]).toBeInstanceOf(Adult)
  })

  it('can get only derived results when calling getter of derived entity', async () => {
    createStore([Person, Adult])

    await Person.insert({ id: 1, name: 'John' })

    await Adult.insert({ id: 2, name: 'Jane', job: 'Software Engineer' })

    const adults = Adult.all()

    expect(adults.length).toBe(1)

    expect(adults[0].name).toBe('Jane')
    expect(adults[0]).toBeInstanceOf(Adult)
  })

  it('should clean only corresponding entities (and derived ones) when calling create', async () => {
    createStore([Person, Adult, Child])

    await Person.insert([
      { id: 1, name: 'A', type: 'PERSON' },
      { id: 2, name: 'B', type: 'ADULT' },
      { id: 3, name: 'D', type: 'CHILD' }
    ])

    expect(Person.all().length).toBe(3)

    await Adult.create({ id: 4, name: 'E' })

    expect(Person.all().length).toBe(3)

    const adults = Adult.all()

    expect(adults.length).toBe(1)
    expect(adults[0].id).toBe(4)
  })

  it('should update derived data without changing its class when calling base update', async () => {
    createStore([Person, Adult])

    await Person.create([
      { id: 1, name: 'A', type: 'PERSON' },
      { id: 2, name: 'B', type: 'ADULT' }
    ])

    expect((Person.find(2) as Adult).name).toBe('B')

    await Person.update({ name: 'C' }, { where: 2 })

    const adult = Person.find(2) as Adult

    expect(adult.name).toBe('C')
    expect(adult).toBeInstanceOf(Adult)
  })

  it('should update data with a closure using instanceof', async () => {
    createStore([Person, Adult])

    await Person.create([
      { id: 1, name: 'A', type: 'PERSON' },
      { id: 2, name: 'B', type: 'ADULT' }
    ])

    await Person.update(
      { name: 'C' },
      { where: (record) => record instanceof Adult }
    )

    const adult = Person.find(2) as Adult

    expect(adult.name).toBe('C')
    expect(adult).toBeInstanceOf(Adult)
  })

  it('should update or insert mixed data', async () => {
    const store = createStore([Person, Adult])

    await Person.create({
      id: 1,
      name: 'John Doe',
      job: 'Software Engineer',
      type: 'ADULT'
    })

    await Person.insertOrUpdate([
      { id: 1, name: 'John Doe', job: 'Writer', type: 'ADULT' },
      { id: 2, name: 'Jane Doe', job: 'QA', type: 'ADULT' },
      { id: 3, name: 'Jane Doe', type: 'PERSON' }
    ])

    const expected = createState({
      person: {
        1: { $id: '1', id: 1, name: 'John Doe', job: 'Writer', type: 'ADULT' },
        2: { $id: '2', id: 2, name: 'Jane Doe', job: 'QA', type: 'ADULT' },
        3: { $id: '3', id: 3, name: 'Jane Doe', type: 'PERSON' }
      },
      adult: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('should update only derived data when field is a derived entity field', async () => {
    createStore([Person, Adult])

    await Person.create([
      { id: 1, name: 'A', type: 'PERSON' },
      { id: 2, name: 'B', job: 'Software Engineer', type: 'ADULT' }
    ])

    await Person.update(
      { job: 'Writer' },
      { where: (record) => record instanceof Person }
    )

    const person = Person.find(1) as any
    expect(person.job).toBe(undefined)

    const adult = Person.find(2) as Adult
    expect(adult.job).toBe('Writer')
  })

  it('should delete record correctly when manipulating a derived entity', async () => {
    createStore([Person, Adult])

    await Person.create([
      { id: 1, name: 'A', type: 'PERSON' },
      { id: 2, name: 'B', type: 'ADULT' }
    ])

    expect(Person.all().length).toBe(2)

    await Adult.delete(2)

    const people = Person.all()

    expect(people.length).toBe(1)
    expect(people[0].id).toBe(1)
  })

  it('should delete only derived records when calling deleteAll on derived entity', async () => {
    createStore([Person, Adult])

    await Person.create([
      { id: 1, name: 'A', type: 'PERSON' },
      { id: 2, name: 'B', type: 'ADULT' }
    ])

    expect(Person.all().length).toBe(2)

    await Adult.deleteAll()

    const people = Person.all()

    expect(people.length).toBe(1)
    expect(people[0].id).toBe(1)
  })
})
