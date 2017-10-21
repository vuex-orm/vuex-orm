import Model, { Fields } from 'app/Model'
import Post from './Post'
import Like from './Like'

export default class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      post_id: this.attr(null),
      body: this.attr(''),
      post: this.belongsTo(Post, 'post_id'),
      likes: this.hasMany(Like, 'comment_id')
    }
  }
}
