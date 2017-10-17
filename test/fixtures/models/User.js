import Model, { Fields } from 'app/Model'
import Profile from './Profile'

export default class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      profile: this.hasOne(Profile, 'user_id')
    }
  }
}
