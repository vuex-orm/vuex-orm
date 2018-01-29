import Query from 'app/repo/Query'
import { createState } from 'test/support/Helpers'

describe('Query – Hooks', () => {
  afterEach(() => {
    Query.hooks = []
  })

  it('can add `beforeProcess` hooks', () => {
    const state = createState('entities', { users: {} })

    Query.on('beforeProcess', (record, entity) => {
      return [{ name: 'John Doe' }]
    })

    const query = new Query(state.entities, 'users')

    expect(query.get()).toEqual([{ name: 'John Doe' }])
  })

  it('can add `afterWhere` hooks', () => {
    const state = createState('entities', { users: {} })

    Query.on('afterWhere', (record, entity) => {
      return [{ name: 'John Doe' }]
    })

    const query = new Query(state.entities, 'users')

    expect(query.get()).toEqual([{ name: 'John Doe' }])
  })

  it('can add `afterOrderBy` hooks', () => {
    const state = createState('entities', { users: {} })

    Query.on('afterOrderBy', (record, entity) => {
      return [{ name: 'John Doe' }]
    })

    const query = new Query(state.entities, 'users')

    expect(query.get()).toEqual([{ name: 'John Doe' }])
  })

  it('can add `afterLimit` hooks', () => {
    const state = createState('entities', { users: {} })

    Query.on('afterLimit', (record, entity) => {
      return [{ name: 'John Doe' }]
    })

    const query = new Query(state.entities, 'users')

    expect(query.get()).toEqual([{ name: 'John Doe' }])
  })
})
