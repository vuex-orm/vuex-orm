import Model from 'app/model/Model'

describe('Unit – Model - Utility', () => {
  describe('getModelFromRecord method', () => {
    it('should return null when record is empty', () => {
      class User extends Model {
                static entity = 'users'
      }

      const result = User.getModelFromRecord()
      expect(result).toBe(null)
    })

    it('should return model when record is already a model', () => {
      class User extends Model {
                static entity = 'users'
      }

      const user = new User()

      const result = User.getModelFromRecord(user)
      expect(result).toBe(User)
    })

    it('should return right model when record is in a hierarchy', () => {
      class User extends Model {
                static entity = 'users'

                static typeKey = 'type'

                static types () {
                  return {
                    'USER': User,
                    'SUPER': SuperUser
                  }
                }
      }

      class SuperUser extends User {
                static entity = 'superusers'
                static baseEntity = 'users'
      }

      let superU = { type: 'SUPER' }
      let user = { type: 'USER' }

      const result = User.getModelFromRecord(user)
      expect(result).toBe(User)

      const result2 = User.getModelFromRecord(superU)
      expect(result2).toBe(SuperUser)
    })

    it('should return null when model was not found', () => {
      class User extends Model {
                static entity = 'users'

                static typeKey = 'type'

                static types () {
                  return {
                    'USER': User,
                    'SUPER': SuperUser
                  }
                }
      }

      class SuperUser extends User {
                static entity = 'superusers'
                static baseEntity = 'users'
      }

      let test = { type: 'UNKNOWN' }

      const result = User.getModelFromRecord(test)
      expect(result).toBe(null)

      const result2 = User.getModelFromRecord({ data: 'bla' })
      expect(result2).toBe(null)
    })
  })
})
