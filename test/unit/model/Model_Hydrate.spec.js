import Model from 'app/model/Model'

describe('Model – Hydrate', () => {
  it('can fix the given data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const data = { id: 1, name: 'John', age: 24, role: 'user' }

    const expected = { id: 1, name: 'John' }

    expect(User.fix(data)).toEqual(expected)
  })

  it('can keep specified field untouched when fixing the given data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const data = { $id: 1, id: 1, name: 'John', age: 24, role: 'user' }

    const expected = { $id: 1, id: 1, name: 'John' }

    expect(User.fix(data, ['$id'])).toEqual(expected)
  })

  it('can fix many data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const data = {
      '1': { id: 1, name: 'John', age: 24, role: 'user' },
      '2': { id: 2, age: 26, role: 'admin' }
    }

    const expected = {
      '1': { id: 1, name: 'John' },
      '2': { id: 2 }
    }

    expect(User.fixMany(data)).toEqual(expected)
  })

  it('can keep specified field untouched when fixing can fixing many data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const data = {
      '1': { $id: 1, id: 1, name: 'John', age: 24, role: 'user' },
      '2': { $id: 2, id: 2, age: 26, role: 'admin' }
    }

    const expected = {
      '1': { $id: 1, id: 1, name: 'John' },
      '2': { $id: 2, id: 2 }
    }

    expect(User.fixMany(data, ['$id'])).toEqual(expected)
  })

  it('can fill the given data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John')
        }
      }
    }

    const data = { id: 1, role: 'user' }

    const expected = { id: 1, name: 'John' }

    expect(User.hydrate(data)).toEqual(expected)
  })

  it('can keep specified field untouched when filling the given data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John')
        }
      }
    }

    const data = { $id: 1, id: 1, role: 'user' }

    const expected = { $id: 1, id: 1, name: 'John' }

    expect(User.hydrate(data, ['$id'])).toEqual(expected)
  })

  it('can fill many data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John')
        }
      }
    }

    const data = {
      '1': { id: 1, age: 24, role: 'user' },
      '2': { id: 2, age: 26, role: 'admin' }
    }

    const expected = {
      '1': { id: 1, name: 'John' },
      '2': { id: 2, name: 'John' }
    }

    expect(User.hydrateMany(data)).toEqual(expected)
  })

  it('can keep specified field untouched when filling many data', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John')
        }
      }
    }

    const data = {
      '1': { $id: 1, id: 1, age: 24, role: 'user' },
      '2': { $id: 2, id: 2, age: 26, role: 'admin' }
    }

    const expected = {
      '1': { $id: 1, id: 1, name: 'John' },
      '2': { $id: 2, id: 2, name: 'John' }
    }

    expect(User.hydrateMany(data, ['$id'])).toEqual(expected)
  })

  it('can fill the properties by the default values no record are passed', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John')
        }
      }
    }

    const expected = { id: null, name: 'John' }

    expect(User.fill()).toEqual(expected)
  })
})
