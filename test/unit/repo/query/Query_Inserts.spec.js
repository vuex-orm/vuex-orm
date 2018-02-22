import { createState } from 'test/support/Helpers'
import Query from 'app/repo/Query'

describe('Query – Inserts', () => {
  it('can create a data', () => {
    const state = createState('entities', { users: {} })

    const query = new Query(state, 'users')

    const data = {
      '1': { $id: 1, id: 1, name: 'John Doe' }
    }

    query.create(data)

    expect(state.users.data).toEqual(data)
  })
})
