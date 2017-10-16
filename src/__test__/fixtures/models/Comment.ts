import Model, { Fields } from '../../../Model'

export default class Comment extends Model {
  static entity = 'comments'

  static fields (): Fields {
    return {
      id: this.attr(null),
      post_id: this.attr(null),
      body: this.attr('')
    }
  }
}
