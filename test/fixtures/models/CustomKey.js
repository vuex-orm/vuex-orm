import Model, { Fields } from 'app/model/Model'

export default class CustomKey extends Model {
  static entity = 'customKeys'

  static primaryKey = 'my_id'

  static fields () {
    return {
      id: this.attr(null),
      my_id: this.attr(null)
    }
  }
}
