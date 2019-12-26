import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Inheritance', () => {
  class Person extends Model {
    static entity = 'person'

    static types () {
      return {
        ADULT: Adult,
        PERSON: Person,
        CHILD: Child
      }
    }

    static fields () {
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

    static fields () {
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

    static fields () {
      return {
        ...super.fields()
      }
    }
  }

  it('should return right type string for given mode', () => {
    expect(Model.getTypeKeyValueFromModel()).toBe(null)
    expect(Person.getTypeKeyValueFromModel()).toBe('PERSON')
    expect(Adult.getTypeKeyValueFromModel()).toBe('ADULT')
    expect(Child.getTypeKeyValueFromModel()).toBe('CHILD')
  })

  it('sets right class for derived entity', async () => {
    createStore([Person, Adult])

    await Adult.insert({
      data: { id: 1, name: 'John Doe' }
    })

    expect(Adult.find(1)).toBeInstanceOf(Adult)
  })

  it('should inherit fields from root entity', async () => {
    createStore([Person, Adult])

    await Adult.insert({
      data: { id: 2, name: 'John Doe' }
    })

    const adult = Adult.find(2) as Adult

    expect(adult.id).toBe(2)
    expect(adult.name).toBe('John Doe')
  })

  it('should have own fields only on derived entity', async () => {
    createStore([Person, Adult])

    await Person.insert({
      data: { id: 1, name: 'John' }
    })

    await Adult.insert({
      data: { id: 2, name: 'Jane', job: 'Software Engineer' }
    })

    const person = Person.find(1) as any
    expect(person.job).toBe(undefined)

    const adult = Adult.find(2) as Adult
    expect(adult.job).toBe('Software Engineer')
  })
})

describe('Feature - Inheritance - No Type Warning', () => {
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
    const spy = jest.spyOn(global.console, 'warn').mockImplementation()

    createStore([Person, Adult])

    expect(spy).toHaveBeenCalled()
  })
})
