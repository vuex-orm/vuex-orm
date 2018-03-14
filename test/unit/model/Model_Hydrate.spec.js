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

  it('can fix the given data with nested fields', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          settings: {
            role: this.attr('')
          }
        }
      }
    }

    const data = {
      id: 1,
      name: 'John',
      age: 24,
      role: 'user',
      settings: {
        role: 'user',
        email: 'jonh@example.com'
      }
    }

    const expected = {
      id: 1,
      name: 'John',
      settings: {
        role: 'user'
      }
    }

    expect(User.fix(data)).toEqual(expected)
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

    expect(User.fill(data)).toEqual(expected)
  })

  it('can fill the given data woth nested field', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('John'),
          settings: {
            role: this.attr('user')
          }
        }
      }
    }

    const data = {
      id: 1,
      age: 24,
      role: 'user',
      settings: {
        email: 'jonh@example.com'
      }
    }

    const expected = {
      id: 1,
      name: 'John',
      settings: {
        role: 'user'
      }
    }

    expect(User.fill(data)).toEqual(expected)
  })
})
