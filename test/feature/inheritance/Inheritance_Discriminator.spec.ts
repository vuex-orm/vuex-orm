import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature - Inheritance - Discriminator field', () => {
  it('uses default `type` field when no typeKey is defined', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          PERSON: Person,
          ADULT: Adult
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'
    }

    createStore([Person, Adult])

    await Person.insert({
      data: { id: 1, name: 'John Doe', type: 'ADULT' }
    })

    expect(Adult.find(1)).toBeInstanceOf(Adult)
  })

  it('uses overwritten typeKey as discriminator when defined', async () => {
    class Person extends Model {
      static entity = 'person'

      static typeKey = 'the_key'

      static types() {
        return {
          PERSON: Person,
          ADULT: Adult
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          the_key: this.attr('')
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'
    }

    createStore([Person, Adult])

    await Person.insert({
      data: { id: 1, name: 'John Doe', the_key: 'ADULT' }
    })

    expect(Adult.find(1)).toBeInstanceOf(Adult)
  })

  it('dispatches mixed data and hydrates with the right models', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          PERSON: Person,
          ADULT: Adult,
          CHILD: Child
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          type: this.attr('')
        }
      }
    }

    class Child extends Person {
      static entity = 'child'
      static baseEntity = 'person'
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'
    }

    createStore([Person, Adult, Child])

    await Person.insert({
      data: [
        { id: 1, name: 'John Doe', type: 'ADULT' },
        { id: 2, name: 'John Doe Jr', type: 'CHILD' },
        { id: 3, name: 'Doe', type: 'PERSON' },
        { id: 4, name: 'Jane Doe', type: 'ADULT' }
      ]
    })

    const adults = Adult.all()
    expect(adults.length).toBe(2)
    expect(adults[0]).toBeInstanceOf(Adult)

    const children = Child.all()
    expect(children.length).toBe(1)
    expect(children[0]).toBeInstanceOf(Child)

    const persons = Person.all()
    expect(persons.length).toBe(4)
  })

  it('should set the right discriminator value if inserted through derived Query', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          PERSON: Person,
          ADULT: Adult
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          type: this.attr('')
        }
      }

      type!: any
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'
    }

    createStore([Person, Adult])

    // Inserting through "adult" model.
    await Adult.create({
      data: { id: 1, name: 'John Doe' }
    })

    const adult = Adult.find(1) as Adult
    expect(adult.type).toBe('ADULT')
  })

  it('should handle discriminator as Number', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          0: Person,
          1: Adult
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          type: this.number(0)
        }
      }

      name!: any
      type!: any
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'
    }

    createStore([Person, Adult])

    await Person.create({
      data: [
        { id: 1, name: 'John Doe', type: 1 },
        { id: 2, name: 'Person Doe', type: 0 }
      ]
    })

    const person = Person.find(2) as Person
    expect(person.name).toBe('Person Doe')
    expect(person.type).toBe(0)

    const adult = Adult.find(1) as Adult
    expect(adult.name).toBe('John Doe')
  })
})
