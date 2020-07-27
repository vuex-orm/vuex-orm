import { createStore, createState } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature - Inheritance - CRUD', () => {
  class Person extends Model {
    static entity = 'person'

    static types() {
      return {
        ADULT: Adult,
        CHILD: Child
      }
    }

    static fields() {
      return {
        id: this.attr(null),
        name: this.attr(''),
        type: this.string(''),
        role_id: this.attr(null),
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
        title: this.string(''),
        jobs: this.hasMany(Job, 'adult_id')
      }
    }

    title!: string
    jobs!: any
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

  class Job extends Model {
    static entity = 'job'

    static types() {
      return {
        office: OfficeJob,
        remote: RemoteJob
      }
    }

    static fields() {
      return {
        id: this.attr(null),
        type: this.attr(null),
        title: this.string(''),
        adult_id: this.attr(null)
      }
    }

    id!: any
    type!: any
    title!: string
    adult_id!: any
  }

  class OfficeJob extends Job {
    static entity = 'office-job'

    static baseEntity = 'job'

    static fields() {
      return {
        ...super.fields(),
        building: this.morphOne(Building, 'buildingable_id', 'buildingable_type')
      }
    }

    building!: any
  }

  class Building extends Model {
    static entity = 'building'

    static fields() {
      return {
        id: this.attr(null),
        address: this.string(''),
        buildingable_id: this.attr(null),
        buildingable_type: this.attr(null)
      }
    }
  }

  class RemoteJob extends Job {
    static entity = 'remote-job'

    static baseEntity = 'job'

    static fields() {
      return {
        ...super.fields(),
        locations: this.morphMany(Location, 'locationable_id', 'locationable_type')
      }
    }
  }

  class Location extends Model {
    static entity = 'location'

    static fields() {
      return {
        id: this.attr(null),
        lat: this.number(0),
        lng: this.number(0),
        locationable_id: this.attr(null),
        locationable_type: this.attr(null)
      }
    }
  }

  it('can insert entities with different types', async () => {
    createStore([Person, Adult, Child])

    await Person.insert({
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane', type: 'ADULT' },
        { id: 3, name: 'Jack', type: 'CHILD' },
      ]
    })

    const persons = Person.all()
    const adults = Adult.all()
    const children = Child.all()

    expect(persons.length).toBe(3)
    expect(children.length).toBe(1)
    expect(adults.length).toBe(1)
  })

  it('can insert entities with different types and custom STI relationships', async () => {
    createStore([Person, Adult, Job, OfficeJob, RemoteJob, Building, Location])

    await Person.insert({
      data: [
        {
          id: 1,
          name: 'John'
        },
        {
          id: 2,
          name: 'Jane',
          type: 'ADULT',
          jobs: [
            {
              id: 1,
              title: 'jack of all trades'
            },
            {
              id: 2,
              title: 'Software engineer',
              type: 'office',
              building: { id: 1, address: 'Park Avenue' }
            },
            {
              id: 3,
              title: 'Designer',
              type: 'remote',
              locations: [{ id: 1, lat: 12, lng: 34 }, { id: 2, lat: 56, lng: 78 }]
            }
          ]
        },
      ]
    })

    const persons = Person.all()
    const adults = Adult.all()
    const jobs = Job.all()
    const remoteJobs = RemoteJob.all()
    const officeJobs = OfficeJob.all()
    const buildings = Building.all()
    const locations = Location.all()

    expect(persons.length).toBe(2)
    expect(adults.length).toBe(1)
    expect(jobs.length).toBe(3)
    expect(remoteJobs.length).toBe(1)
    expect(officeJobs.length).toBe(1)
    expect(buildings.length).toBe(1)
    expect(locations.length).toBe(2)
  })

  it('can get mixed results when calling getter of root entity', async () => {
    createStore([Person, Adult])

    await Person.insert({
      data: { id: 1, name: 'John' }
    })

    await Adult.insert({
      data: { id: 2, name: 'Jane' }
    })

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

  it('can fetch mixed data when related to a base entity', async () => {
    createStore([Person, Adult, Child, Role])

    await Role.insert({
      data: [
        { id: 1, roleName: 'Role 1' },
        { id: 2, roleName: 'Role 2' },
      ]
    })

    await Person.insert({
      data: [
        { id: 1, name: 'John', role_id: 1 },
        { id: 2, name: 'Jane', type: 'ADULT', role_id: 1 },
        { id: 3, name: 'Jack', type: 'CHILD', role_id: 1 }
      ]
    })

    const roles = Role.query().with('people').all()
    expect(roles.length).toBe(2)

    // Checking people have been fetched.
    const role = roles.find(r => r.id === 1) as Role
    expect(role.people.length).toBe(3)

    // Checking that there is one Adult in the people array.
    const adults = role.people.filter(p => p instanceof Adult)
    const children = role.people.filter(p => p instanceof Child)
    const other = role.people.filter(p => !(p instanceof Adult) && !(p instanceof Child))
    expect(adults.length).toBe(1)
    expect(children.length).toBe(1)
    expect(other.length).toBe(1)
  })

  it('can get only derived results when calling getter of derived entity', async () => {
    createStore([Person, Adult])

    await Person.insert({
      data: { id: 1, name: 'John' }
    })

    await Adult.insert({
      data: { id: 2, name: 'Jane' }
    })

    const adults = Adult.all()

    expect(adults.length).toBe(1)

    expect(adults[0].name).toBe('Jane')
    expect(adults[0]).toBeInstanceOf(Adult)
  })

  it('can retrieve correct derived entities and their relationships', async () => {
    createStore([Person, Adult, Job, OfficeJob, RemoteJob, Building, Location])

    await Person.insert({
      data: [
        {
          id: 1,
          name: 'John'
        },
        {
          id: 2,
          name: 'Jane',
          type: 'ADULT',
          jobs: [
            {
              id: 1,
              title: 'jack of all trades'
            },
            {
              id: 2,
              title: 'Software engineer',
              type: 'office',
              building: { id: 1, address: 'Park Avenue' }
            },
            {
              id: 3,
              title: 'Designer',
              type: 'remote',
              locations: [{ id: 1, lat: 12, lng: 34 }, { id: 2, lat: 56, lng: 78 }]
            }
          ]
        },
      ]
    })

    const persons = Person.query().withAllRecursive().get() as any
    expect(persons.length).toBe(2)
    expect(persons[0]).not.toBeInstanceOf(Adult)
    expect(persons[1]).toBeInstanceOf(Adult)
    expect(persons[1].jobs.length).toBe(3)
    expect(persons[1].jobs[0]).not.toBeInstanceOf(OfficeJob)
    expect(persons[1].jobs[0]).not.toBeInstanceOf(RemoteJob)
    expect(persons[1].jobs[1]).toBeInstanceOf(OfficeJob)
    expect(persons[1].jobs[2]).toBeInstanceOf(RemoteJob)
    expect(persons[1].jobs[1].building).toBeInstanceOf(Building)
    expect(persons[1].jobs[2].locations.length).toBe(2)
    expect(persons[1].jobs[2].locations[0]).toBeInstanceOf(Location)
    expect(persons[1].jobs[2].locations[1]).toBeInstanceOf(Location)
  })

  it('should clean only corresponding entities (and derived ones) when calling create', async () => {
    createStore([Person, Adult, Child])

    await Person.insert({
      data: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B', type: 'ADULT' },
        { id: 3, name: 'D', type: 'CHILD' }
      ]
    })

    expect(Person.all().length).toBe(3)

    await Adult.create({
      data: { id: 4, name: 'E' }
    })

    expect(Person.all().length).toBe(3)

    const adults = Adult.all()

    expect(adults.length).toBe(1)
    expect(adults[0].id).toBe(4)
  })

  it('should update derived data without changing its class when calling base update', async () => {
    createStore([Person, Adult])

    await Person.create({
      data: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B', type: 'ADULT' }
      ]
    })

    expect((Person.find(2) as Adult).name).toBe('B')

    await Person.update({
      where: 2,
      data: { name: 'C' }
    })

    const adult = Person.find(2) as Adult

    expect(adult.name).toBe('C')
    expect(adult).toBeInstanceOf(Adult)
  })

  it('should update data with a closure using instanceof', async () => {
    createStore([Person, Adult])

    await Person.create({
      data: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B', type: 'ADULT' }
      ]
    })

    await Person.update({
      where: (record) => record instanceof Adult,
      data: { name: 'C' }
    })

    const adult = Person.find(2) as Adult

    expect(adult.name).toBe('C')
    expect(adult).toBeInstanceOf(Adult)
  })

  it('should update or insert mixed data', async () => {
    const store = createStore([Person, Adult])

    await Person.create({
      data: { id: 1, name: 'John Doe', type: 'ADULT' }
    })

    await Person.insertOrUpdate({
      data: [
        { id: 1, name: 'Jane Doe', type: 'ADULT' },
        { id: 2, name: 'Jane Doe', type: 'ADULT' },
        { id: 3, name: 'Jane Doe' }
      ]
    })

    const expected = createState({
      person: {
        1: { $id: '1', id: 1, name: 'Jane Doe', role_id: null, type: 'ADULT', title: '', jobs: [] },
        2: { $id: '2', id: 2, name: 'Jane Doe', role_id: null, type: 'ADULT', title: '', jobs: [] },
        3: { $id: '3', id: 3, name: 'Jane Doe', role_id: null, type: '' }
      },
      adult: {}
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('should update only derived data when field is a derived entity field', async () => {
    createStore([Person, Adult])

    await Person.create({
      data: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B', type: 'ADULT', title: 'Mr.' }
      ]
    })

    await Person.update({
      where: (record) => record instanceof Person,
      data: { title: 'Ms.' }
    })

    const person = Person.find(1) as any
    expect(person.title).toBe(undefined)

    const adult = Person.find(2) as Adult
    expect(adult.title).toBe('Ms.')
  })

  it('should delete record correctly when manipulating a derived entity', async () => {
    createStore([Person, Adult])

    await Person.create({
      data: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B', type: 'ADULT' }
      ]
    })

    expect(Person.all().length).toBe(2)

    await Adult.delete(2)

    const people = Person.all()

    expect(people.length).toBe(1)
    expect(people[0].id).toBe(1)
  })

  it('should delete only derived records when calling deleteAll on derived entity', async () => {
    createStore([Person, Adult])

    await Person.create({
      data: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B', type: 'ADULT' }
      ]
    })

    expect(Person.all().length).toBe(2)

    await Adult.deleteAll()

    const people = Person.all()

    expect(people.length).toBe(1)
    expect(people[0].id).toBe(1)
  })
})

