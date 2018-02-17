import Model, { Fields } from 'app/model/Model'

export default class CustomKey extends Model {
  static entity = 'compositeKeys'

  static primaryKey = ['user_id', 'vote_id']

  static fields () {
    return {
      user_id: this.attr(''),
      vote_id: this.attr(''),
      text: this.attr('')
    }
  }
}
