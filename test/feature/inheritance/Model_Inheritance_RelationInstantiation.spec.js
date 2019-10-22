import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Model – Inheritance - Relation instantiation', () => {
  it('should choose the appropriate STI model class when instantiating a belongsTo relation', () => {
    class Employee extends Model {
      static entity = 'employee'

      static fields () {
        return {
          id: this.attr(null),
          name: this.string(''),
          type: this.string('')
        }
      }

      static types () {
        return {
          boss: Boss
        }
      }
    }

    class Boss extends Employee {
      static entity = 'boss'
      static baseEntity = 'employee'
    }

    class Firm extends Model {
      static entity = 'firm'

      static fields () {
        return {
          id: this.attr(null),
          owner_id: this.attr(null),
          name: this.string(''),
          employees: this.hasMany(Employee, 'firm_id'),
          owner: this.belongsTo(Employee, 'owner_id')
        }
      }
    }

    createStore([
      { model: Employee },
      { model: Boss },
      { model: Firm }
    ])

    const firmData = {
      id: 1,
      name: 'VUEX ORM Ltd.',
      owner: { id: 'Jax', type: 'boss' }
    }

    const firm = new Firm(firmData)

    expect(firm.owner).toBeInstanceOf(Boss)
  })

  it('should choose the appropriate STI model class when instantiating hasMany relations', () => {
    class Employee extends Model {
      static entity = 'employee'

      static fields () {
        return {
          id: this.attr(null),
          firm_id: this.attr(null),
          name: this.string(''),
          type: this.string('')
        }
      }

      static types () {
        return {
          HR: HumanResources,
          CEO: ChiefExecutiveOfficer
        }
      }
    }

    class HumanResources extends Employee {
      static entity = 'hr'
      static baseEntity = 'employee'
    }

    class ChiefExecutiveOfficer extends Employee {
      static entity = 'ceo'
      static baseEntity = 'employee'
    }

    class Firm extends Model {
      static entity = 'firm'

      static fields () {
        return {
          id: this.attr(null),
          name: this.string(''),
          employees: this.hasMany(Employee, 'firm_id')
        }
      }
    }

    createStore([
      { model: Employee },
      { model: HumanResources },
      { model: ChiefExecutiveOfficer },
      { model: Firm }
    ])

    const firmData = {
      id: 1,
      name: 'VUEX ORM Ltd.',
      employees: [
        { id: 1, name: 'John', type: 'HR' },
        { id: 2, name: 'Jane', type: 'CEO' }
      ]
    }

    const firm = new Firm(firmData)

    expect(firm.employees.find(({ id }) => id === 1)).toBeInstanceOf(HumanResources)
    expect(firm.employees.find(({ id }) => id === 2)).toBeInstanceOf(ChiefExecutiveOfficer)
  })

  it('should choose the appropriate STI model class when instantiating a morphTo relation', () => {
    class User extends Model {
      static entity = 'user'

      static fields () {
        return {
          id: this.attr(null),
          name: this.string(''),
          image: this.morphOne(Image, 'imageable_id', 'imageable_type')
        }
      }

      static types () {
        return {
          admin: Admin,
          user: User
        }
      }
    }

    class Admin extends User {
      static entity = 'admin'
      static baseEntity = 'user'
    }

    class Image extends Model {
      static entity = 'image'

      static fields () {
        return {
          id: this.attr(null),
          url: this.attr(''),
          imageable_id: this.attr(null),
          imageable_type: this.attr(null),
          imageable: this.morphTo('imageable_id', 'imageable_type')
        }
      }
    }

    createStore([
      { model: User },
      { model: Admin },
      { model: Image }
    ])

    const imageData = {
      id: 1,
      url: 'myPng.gif',
      imageable_type: 'user',
      imageable: { id: 1, name: 'Jane', type: 'admin' }
    }

    const image = new Image(imageData)

    expect(image.imageable).toBeInstanceOf(Admin)
  })
})
