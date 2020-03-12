/* tslint:disable:variable-name */
import { createStore } from 'test/support/Helpers'
import Model from '@/model/Model'

describe('Feature – Relations – Retrieve – Self Relation', () => {
  it('can resolve self relation', async () => {
    class Post extends Model {
      static entity = 'posts'

      // @Attribute
      id!: number

      // @Attribute
      parent_id!: number

      // @BelongsTo(Post, 'parent_id')
      parent!: Post

      static fields () {
        return {
          id: this.attr(null),
          parent_id: this.attr(null),
          parent: this.belongsTo(Post, 'parent_id')
        }
      }
    }

    createStore([{ model: Post }])

    await Post.insert({ id: 1, parent_id: null })
    await Post.insert({ id: 2, parent_id: 1 })

    const post = Post.query().with('parent').find(2) as Post

    expect(post.parent).toBeInstanceOf(Post)
  })
})
