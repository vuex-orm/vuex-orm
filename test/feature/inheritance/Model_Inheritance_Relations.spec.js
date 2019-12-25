import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature - Inheritance - Relations', () => {
  it('can fetch a related data defined on derived entity', async () => {
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
          PERSON: Person
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields () {
        return {
          ...super.fields(),
          jobs: this.hasMany(Job, 'adult_id')
        }
      }
    }

    class Job extends Model {
      static entity = 'jobs'

      static fields () {
        return {
          id: this.attr(null),
          adult_id: this.attr(null),
          title: this.attr(''),
          adult: this.belongsTo(Adult, 'adult_id')
        }
      }
    }

    const store = createStore([{ model: Person }, { model: Adult }, { model: Job }])
    store.dispatch('entities/jobs/insert', {
      data: {
        id: 1,
        title: 'Software Engineer',
        adult_id: 2
      }
    })

    store.dispatch('entities/person/insert', {
      data: [{
        id: 1,
        name: 'John',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'Jane',
        type: 'ADULT'
      }
      ]
    })

    const adult = Adult.query().with('jobs').all()
    expect(adult.length).toBe(1)
    expect(adult[0].id).toBe(2)
    expect(adult[0].jobs.length).toBe(1)
  })

  it('can fetch a related data which is a derived entity', async () => {
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
          PERSON: Person
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields () {
        return {
          ...super.fields(),
          jobs: this.hasMany(Job, 'adult_id')
        }
      }
    }

    class Job extends Model {
      static entity = 'jobs'

      static fields () {
        return {
          id: this.attr(null),
          adult_id: this.attr(null),
          title: this.attr(''),
          adult: this.belongsTo(Adult, 'adult_id')
        }
      }
    }

    const store = createStore([{ model: Person }, { model: Adult }, { model: Job }])

    store.dispatch('entities/jobs/insert', {
      data: {
        id: 1,
        title: 'Software Engineer',
        adult_id: 2
      }
    })

    store.dispatch('entities/person/insert', {
      data: [{
        id: 1,
        name: 'John',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'Jane',
        type: 'ADULT'
      }
      ]
    })

    const job = Job.query().with('adult').all()
    expect(job.length).toBe(1)
    expect(job[0].adult).not.toBe(null)
    expect(job[0].adult.id).toBe(2)
  })

  it('can fetch mixed data when related to a base entity', async () => {
    class Person extends Model {
      static entity = 'person'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          role_id: this.attr(null),
          type: this.string('')
        }
      }

      static types () {
        return {
          ADULT: Adult,
          PERSON: Person
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

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null),
          roleName: this.attr(''),
          persons: this.hasMany(Person, 'role_id')
        }
      }
    }

    const store = createStore([{ model: Person }, { model: Adult }, { model: Role }])

    store.dispatch('entities/roles/insert', {
      data: [{
        id: 1,
        roleName: 'Role 1'
      }, {
        id: 2,
        roleName: 'Role 2'
      }]
    })

    store.dispatch('entities/person/insert', {
      data: [{
        id: 1,
        name: 'John',
        type: 'PERSON',
        role_id: 1
      }, {
        id: 2,
        name: 'Jane',
        type: 'ADULT',
        role_id: 1
      }
      ]
    })

    const roles = Role.query().with('persons').all()
    expect(roles.length).toBe(2)

    // Checking persons have been fetched
    const role = roles.filter(r => r.id === 1)[0]
    expect(role.persons.length).toBe(2)

    // Checking that there is one Adult in the persons array
    const adults = role.persons.filter(p => p instanceof Adult)
    expect(adults.length).toBe(1)
    expect(adults[0].id).toBe(2)
  })

  it('should keep right type when fetching related data from base entity', async () => {
    class Person extends Model {
      static entity = 'person'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          role_id: this.attr(null),
          role: this.belongsTo(Role, 'role_id'),
          type: this.string('')
        }
      }

      static types () {
        return {
          ADULT: Adult,
          PERSON: Person
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

    class Role extends Model {
      static entity = 'roles'

      static fields () {
        return {
          id: this.attr(null),
          roleName: this.attr(''),
          persons: this.hasMany(Person, 'role_id')
        }
      }
    }

    const store = createStore([{
      model: Person
    }, {
      model: Adult
    }, {
      model: Role
    }])

    store.dispatch('entities/roles/insert', {
      data: [{
        id: 1,
        roleName: 'Role 1'
      }, {
        id: 2,
        roleName: 'Role 2'
      }]
    })

    store.dispatch('entities/person/insert', {
      data: [{
        id: 1,
        name: 'John',
        type: 'PERSON',
        role_id: 1
      }, {
        id: 2,
        name: 'Jane',
        type: 'ADULT',
        role_id: 2
      }]
    })

    // Reverse check: getting all persons and their associated role
    const persons = Person.query().with('role').all()
    expect(persons.length).toBe(2)

    const firstPerson = persons.filter(p => p.id === 1)[0]
    expect(firstPerson).toBeInstanceOf(Person)
    expect(firstPerson.role.id).toBe(1)

    const secondPerson = persons.filter(p => p.id === 2)[0]
    expect(secondPerson).toBeInstanceOf(Adult)
    expect(secondPerson.role.id).toBe(2)
  })

  it('should allow definition of relationship to derived / base entities', () => {
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
          child: this.belongsTo(Child, 'child_id'),
          child_id: this.attr(null)
        }
      }
    }

    class Child extends Person {
      static entity = 'child'

      static baseEntity = 'person'

      static fields () {
        return {
          ...super.fields(),
          parents: this.hasMany(Adult, 'child_id')
        }
      }
    }

    const store = createStore([{ model: Person }, { model: Adult }, { model: Child }])

    store.dispatch('entities/person/insert', {
      data: [{
        id: 1,
        name: 'John',
        type: 'ADULT',
        child_id: 3
      }, {
        id: 2,
        name: 'Jane',
        type: 'ADULT',
        child_id: 3
      }, {
        id: 3,
        name: 'Jane',
        type: 'CHILD'
      }
      ]
    })

    const adults = Adult.query().with('child').all()
    expect(adults.length).toBe(2)
    expect(adults[0].child.id).toBe(3)
    expect(adults[1].child.id).toBe(3)

    const child = Child.query().with('parents').all()
    expect(child.length).toBe(1)
    expect(child[0].parents.length).toBe(2)
  })

  it('can fetch a related data defined on derived entity when calling root getter', async () => {
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
          PERSON: Person
        }
      }
    }

    class Adult extends Person {
      static entity = 'adult'

      static baseEntity = 'person'

      static fields () {
        return {
          ...super.fields(),
          jobs: this.hasMany(Job, 'adult_id')
        }
      }
    }

    class Job extends Model {
      static entity = 'jobs'

      static fields () {
        return {
          id: this.attr(null),
          adult_id: this.attr(null),
          title: this.attr(''),
          adult: this.belongsTo(Adult, 'adult_id')
        }
      }
    }

    const store = createStore([{ model: Person }, { model: Adult }, { model: Job }])
    store.dispatch('entities/jobs/insert', {
      data: {
        id: 1,
        title: 'Software Engineer',
        adult_id: 2
      }
    })

    store.dispatch('entities/person/insert', {
      data: [{
        id: 1,
        name: 'John',
        type: 'PERSON'
      }, {
        id: 2,
        name: 'Jane',
        type: 'ADULT'
      }
      ]
    })

    const persons = Person.query().with(['jobs', 'dummy']).all()
    expect(persons.length).toBe(2)

    const adult = persons.filter(p => p.id === 2)[0]
    expect(adult.jobs.length).toBe(1)
  })
})
