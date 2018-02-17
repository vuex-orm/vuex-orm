import Model, { Fields } from 'app/model/Model'
import Profile from './Profile'
import Post from './Post'
import Account from './Account'

export default class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      settings: {
        role: this.attr(''),
        accounts: this.hasMany(Account, 'user_id')
      },
      posts: this.hasMany(Post, 'user_id'),
      profile: this.hasOne(Profile, 'user_id')
    }
  }

  isAdmin () {
    return this.settings.role === 'admin'
  }
}
