import { createStore, createState } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Utils from 'app/support/Utils'

describe('Feature – Models – Insert Or Update', () => {
  class User extends Model {
    static entity = 'users'

    static fields () {
      return {
        id: this.attr(null),
        name: this.attr('')
      }
    }
  }

  it('can insert or update records via static method', async () => {
    const store = createStore([{ model: User }])

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' }
      ]
    })

    await User.insertOrUpdate({
      data: [
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'Johnny Doe' }
      ]
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' },
        2: { $id: '2', id: 2, name: 'Johnny Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert or update records via instance method', async () => {
    const store = createStore([{ model: User }])

    const user = new User()

    await User.insert({
      data: [
        { id: 1, name: 'John Doe' }
      ]
    })

    await user.$insertOrUpdate({
      data: [
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'Johnny Doe' }
      ]
    })

    const expected = createState({
      users: {
        1: { $id: '1', id: 1, name: 'Jane Doe' },
        2: { $id: '2', id: 2, name: 'Johnny Doe' }
      }
    })

    expect(store.state.entities).toEqual(expected)
  })

  it('can insert or update records via static method while preserving input data', async () => {
    class Author extends Model {
      static entity = 'authors'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr(''),
          posts: this.hasMany(Post, 'author_id'),
          comments: this.hasMany(Comment, 'author_id')
        }
      }
    }

    class Post extends Model {
      static entity = 'posts'

      static fields () {
        return {
          id: this.attr(null),
          author_id: this.attr(null),
          comments_ids: this.attr([]),
          title: this.attr(''),
          author: this.belongsTo(Author, 'author_id'),
          comments: this.hasManyBy(Comment, 'comments_ids')
        }
      }
    }

    class Comment extends Model {
      static entity = 'comments'

      static fields () {
        return {
          id: this.attr(null),
          author_id: this.attr(null),
          body: this.attr(''),
          author: this.belongsTo(Author, 'author_id')
        }
      }
    }

    const store = createStore([{ model: Author }, { model: Post }, { model: Comment }])

    const data = {
      $id: '1',
      id: 1,
      name: 'John Doe',
      posts: [
        {
          $id: '1',
          id: 1,
          author_id: 1,
          title: 'Post Title',
          comments: [
            {
              $id: '1',
              id: 1,
              author: {
                $id: '2',
                id: 2,
                name: 'Fred Fenster'
              },
              body: 'Comment Body'
            },
            {
              $id: '2',
              id: 2,
              author: {
                $id: '3',
                id: 3,
                name: 'Alejandro Gillick'
              },
              body: 'Comment Body'
            }
          ]
        }
      ]
    }

    const dataBefore = Utils.cloneDeep(data)

    expect(data).toEqual(dataBefore)

    await Author.insertOrUpdate({
      data
    })

    const expected = createState({
      authors: {
        1: {
          $id: '1',
          id: 1,
          name: 'John Doe',
          posts: [],
          comments: []
        },
        2: {
          $id: '2',
          id: 2,
          name: 'Fred Fenster',
          posts: [],
          comments: []
        },
        3: {
          $id: '3',
          id: 3,
          name: 'Alejandro Gillick',
          posts: [],
          comments: []
        }
      },
      posts: {
        1: {
          $id: '1',
          id: 1,
          author_id: 1,
          comments_ids: [1, 2],
          title: 'Post Title',
          comments: [],
          author: null
        }
      },
      comments: {
        1: {
          $id: '1',
          id: 1,
          author_id: 2,
          body: 'Comment Body',
          author: null
        },
        2: {
          $id: '2',
          id: 2,
          author_id: 3,
          body: 'Comment Body',
          author: null
        }
      }
    })

    expect(store.state.entities).toEqual(expected)
    expect(data).toEqual(dataBefore)
  })
})
