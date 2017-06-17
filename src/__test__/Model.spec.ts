import test from 'ava'
import Model from '../Model'

class Post extends Model {
  static fields () {
    return {
      title: this.attr(''),
      body: this.attr('')
    }
  }
}

test('model can define fields', (t) => {
  const expected = {
    title: Model.attr(''),
    body: Model.attr('')
  }

  t.deepEqual<any>(Post.fields(), expected)
})
