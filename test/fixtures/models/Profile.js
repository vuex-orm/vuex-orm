import Model, { Fields } from 'app/Model'
import User from './User'

export default class Profile extends Model {
  static entity = 'profiles'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      user: this.belongsTo(User, 'user_id')
    }
  }
}
