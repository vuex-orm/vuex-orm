import Model, { Fields } from 'app/Model'
import Comment from './Comment'

export default class Like extends Model {
  static entity = 'likes'

  static fields () {
    return {
      id: this.attr(null),
      comment_id: this.attr(null),
      comment: this.belongsTo(Comment, 'comment_id')
    }
  }
}
