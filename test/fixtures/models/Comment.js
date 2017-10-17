import Model, { Fields } from 'app/Model'

export default class Comment extends Model {
  static entity = 'comments'

  static fields () {
    return {
      id: this.attr(null),
      post_id: this.attr(null),
      body: this.attr('')
    }
  }
}
