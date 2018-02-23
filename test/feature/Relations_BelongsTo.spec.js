import Model         from 'app/model/Model';
import {createStore} from 'test/support/Helpers';

describe('Features – Relations – Belongs To', () => {
  it('can insert and fetch nestes belongsTo relations', async () => {
    class User extends Model {
      static entity = "users"

      static fields() {
        return {
          id: this.attr(null),
        }
      }
    }

    class Message extends Model {
      static entity = 'messages'

      static fields() {
        return {
          id: this.attr(null),
          author: this.belongsTo(User, 'author_id'),
          author_id: this.attr(null)
        }
      }
    }

    const store = createStore([{ model: User }, { model: Message }])

    const data = {
      id: 1,
      author: {
        id: 2
      }
    }

    await store.dispatch('entities/messages/create', { data })

    const users = store.getters['entities/users/all']()
    const messages = store.getters['entities/messages/query']().with('author').get()

    expect(users.length).toBe(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].id).toBe(2)
    expect(messages.length).toBe(1)
    expect(messages[0]).toBeInstanceOf(Message)
    expect(messages[0].id).toBe(1)
    expect(messages[0].author).toBeInstanceOf(User)
    expect(messages[0].author.id).toBe(2)
  })
})
