import Model, { Fields } from 'app/model/Model'

export default class Review extends Model {
  static entity = 'reviews'

  static fields () {
    return {
      id: this.attr(null)
    }
  }
}
