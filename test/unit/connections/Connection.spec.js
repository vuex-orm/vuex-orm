import Database from 'app/database/Database'
import Connection from 'app/connections/Connection'

describe('Connection', () => {
  it('throws an error if the database does not contain store', () => {
    const connection = new Connection(new Database())

    expect(() => { connection.store() }).toThrow()
  })
})
