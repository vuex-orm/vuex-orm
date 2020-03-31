import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature - Inheritance - Relations', () => {
  it('can fetch a related data defined on derived entity', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          ADULT: Adult,
          PERSON: Person
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
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields() {
        return {
          ...super.fields(),
          jobs: this.hasMany(Job, 'adult_id')
        }
      }

      jobs!: Job[]
    }

    class Job extends Model {
      static entity = 'jobs'

      static fields() {
        return {
          id: this.attr(null),
          adult_id: this.attr(null),
          title: this.attr(''),
          adult: this.belongsTo(Adult, 'adult_id')
        }
      }
    }

    createStore([Person, Adult, Job])

    await Job.insert({
      data: { id: 1, title: 'Software Engineer', adult_id: 2 }
    })

    await Person.insert({
      data: [
        { id: 1, name: 'John', type: 'PERSON' },
        { id: 2, name: 'Jane', type: 'ADULT' }
      ]
    })

    const adult = Adult.query()
      .with('jobs')
      .all()

    expect(adult.length).toBe(1)
    expect(adult[0].id).toBe(2)
    expect(adult[0].jobs.length).toBe(1)
  })

  it('can fetch a related data which is a derived entity', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          ADULT: Adult,
          PERSON: Person
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
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields() {
        return {
          ...super.fields(),
          jobs: this.hasMany(Job, 'adult_id')
        }
      }

      jobs!: Job[]
    }

    class Job extends Model {
      static entity = 'jobs'

      static fields() {
        return {
          id: this.attr(null),
          adult_id: this.attr(null),
          title: this.attr(''),
          adult: this.belongsTo(Adult, 'adult_id')
        }
      }

      adult!: Adult | null
    }

    createStore([Person, Adult, Job])

    await Job.insert({
      data: { id: 1, title: 'Software Engineer', adult_id: 2 }
    })

    await Person.insert({
      data: [
        { id: 1, name: 'John', type: 'PERSON' },
        { id: 2, name: 'Jane', type: 'ADULT' }
      ]
    })

    const job = Job.query()
      .with('adult')
      .all()

    expect(job.length).toBe(1)
    expect(job[0].adult).not.toBe(null)
    expect((job[0].adult as Adult).id).toBe(2)
  })

  it('can fetch mixed data when related to a base entity', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          ADULT: Adult,
          PERSON: Person
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          role_id: this.attr(null),
          type: this.string('')
        }
      }

      id!: any
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields() {
        return {
          ...super.fields()
        }
      }
    }

    class Role extends Model {
      static entity = 'roles'

      static fields() {
        return {
          id: this.attr(null),
          roleName: this.attr(''),
          people: this.hasMany(Person, 'role_id')
        }
      }

      id!: any
      people!: Person[]
    }

    createStore([Person, Adult, Role])

    await Role.insert({
      data: [
        { id: 1, roleName: 'Role 1' },
        { id: 2, roleName: 'Role 2' }
      ]
    })

    await Person.insert({
      data: [
        { id: 1, name: 'John', type: 'PERSON', role_id: 1 },
        { id: 2, name: 'Jane', type: 'ADULT', role_id: 1 }
      ]
    })

    const roles = Role.query()
      .with('people')
      .all()
    expect(roles.length).toBe(2)

    // Checking people have been fetched.
    const role = roles.filter((r) => r.id === 1)[0]
    expect(role.people.length).toBe(2)

    // Checking that there is one Adult in the people array.
    const adults = role.people.filter((p) => p instanceof Adult)
    expect(adults.length).toBe(1)
    expect(adults[0].id).toBe(2)
  })

  it('should keep right type when fetching related data from base entity', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          ADULT: Adult,
          PERSON: Person
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr(''),
          role_id: this.attr(null),
          type: this.string(''),
          role: this.belongsTo(Role, 'role_id')
        }
      }

      id!: any
      role!: Role | null
    }

    class Adult extends Person {
      static entity = 'adult'
      static baseEntity = 'person'
    }

    class Role extends Model {
      static entity = 'roles'

      static fields() {
        return {
          id: this.attr(null),
          roleName: this.attr(''),
          people: this.hasMany(Person, 'role_id')
        }
      }

      id!: any
    }

    createStore([Person, Adult, Role])

    await Role.insert({
      data: [
        { id: 1, roleName: 'Role 1' },
        { id: 2, roleName: 'Role 2' }
      ]
    })

    await Person.insert({
      data: [
        { id: 1, name: 'John', type: 'PERSON', role_id: 1 },
        { id: 2, name: 'Jane', type: 'ADULT', role_id: 2 }
      ]
    })

    // Reverse check: getting all people and their associated role.
    const people = Person.query()
      .with('role')
      .all()
    expect(people.length).toBe(2)

    const firstPerson = people.filter((p) => p.id === 1)[0]
    expect(firstPerson).toBeInstanceOf(Person)
    expect((firstPerson.role as Role).id).toBe(1)

    const secondPerson = people.filter((p) => p.id === 2)[0]
    expect(secondPerson).toBeInstanceOf(Adult)
    expect((secondPerson.role as Role).id).toBe(2)
  })

  it('should allow definition of relationship to derived / base entities', async () => {
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
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields() {
        return {
          ...super.fields(),
          child: this.belongsTo(Child, 'child_id'),
          child_id: this.attr(null)
        }
      }

      child!: Child
    }

    class Child extends Person {
      static entity = 'child'

      static baseEntity = 'person'

      static fields() {
        return {
          ...super.fields(),
          parents: this.hasMany(Adult, 'child_id')
        }
      }

      parents!: Adult[]
    }

    createStore([Person, Adult, Child])

    await Person.insert({
      data: [
        { id: 1, name: 'John', type: 'ADULT', child_id: 3 },
        { id: 2, name: 'Jane', type: 'ADULT', child_id: 3 },
        { id: 3, name: 'Jane', type: 'CHILD' }
      ]
    })

    const adults = Adult.query()
      .with('child')
      .all()
    expect(adults.length).toBe(2)
    expect(adults[0].child.id).toBe(3)
    expect(adults[1].child.id).toBe(3)

    const children = Child.query()
      .with('parents')
      .all()
    expect(children.length).toBe(1)
    expect(children[0].parents.length).toBe(2)
  })

  it('can fetch a related data defined on derived entity when calling root getter', async () => {
    class Person extends Model {
      static entity = 'person'

      static types() {
        return {
          ADULT: Adult,
          PERSON: Person
        }
      }

      static fields() {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }

      id!: any
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields() {
        return {
          ...super.fields(),
          jobs: this.hasMany(Job, 'adult_id')
        }
      }

      jobs!: Job[]
    }

    class Job extends Model {
      static entity = 'jobs'

      static fields() {
        return {
          id: this.attr(null),
          adult_id: this.attr(null),
          title: this.attr(''),
          adult: this.belongsTo(Adult, 'adult_id')
        }
      }
    }

    createStore([Person, Adult, Job])

    await Job.insert({
      data: { id: 1, title: 'Software Engineer', adult_id: 2 }
    })

    await Person.insert({
      data: [
        { id: 1, name: 'John', type: 'PERSON' },
        { id: 2, name: 'Jane', type: 'ADULT' }
      ]
    })

    const persons = Person.query()
      .with(['jobs', 'dummy'])
      .all()
    expect(persons.length).toBe(2)

    const adult = persons.filter((p) => p.id === 2)[0] as Adult
    expect(adult.jobs.length).toBe(1)
  })
})
