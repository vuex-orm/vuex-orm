import Item from '../data/Item'
import Collection from '../data/Collection'
import Query from '../query/Query'
import RootState from './contracts/RootState'
import GettersContract from './contracts/RootGetters'

const RootGetters: GettersContract = {
  /**
   * Create a new Query instance.
   */
  query: (state: RootState) => (entity: string): Query => {
    return new Query(state, entity)
  },

  /**
   * Get all data of given entity.
   */
  all: (state: RootState) => (entity: string): Collection => {
    return (new Query(state, entity)).all()
  },

  /**
   * Find a data of the given entity by given id.
   */
  find: (state: RootState) => (entity: string, id: string | number): Item => {
    return (new Query(state, entity)).find(id)
  }
}

export default RootGetters
