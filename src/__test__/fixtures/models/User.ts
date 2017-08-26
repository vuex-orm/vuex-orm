import Model, { Fields } from '../../../Model'
import Profile from './Profile'

export default class User extends Model {
  static entity: string = 'users'

  static fields (): Fields {
    return {
      id: this.attr(null),
      profile: this.hasOne(Profile, 'user_id')
    }
  }
}
