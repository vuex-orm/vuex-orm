import test from 'ava'
import * as _ from 'lodash'
import Model from '../Model'
import Database from '../Database'

class Post extends Model {
  static entity = 'posts'
}

test('its can register models', (t) => {
  const database = new Database()

  t.is<number>(_.size(database.entities), 0)

  database.register(Post)

  t.is<any>(database.entities.posts, Post)
})
