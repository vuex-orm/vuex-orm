import Model, { Fields } from 'app/Model'
import Profile from './Profile'
import Post from './Post'

export default class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      posts: this.hasMany(Post, 'user_id'),
      profile: this.hasOne(Profile, 'user_id')
    }
  }
}
