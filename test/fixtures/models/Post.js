import Model, { Fields } from 'app/Model'
import User from './User'
import Comment from './Comment'

export default class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      author: this.belongsTo(User, 'user_id'),
      comments: this.hasMany(Comment, 'post_id')
    }
  }
}
