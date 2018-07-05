import Item from '../data/Item'
import Collection from '../data/Collection'
import Query from '../query/Query'
import RootState from './contracts/RootState'
import GettersContract from './contracts/RootGetters'

const RootGetters: GettersContract = {
  /**
   * Create a new Query instance.
   */
  query: (state: RootState) => (entity: string, wrap?: boolean): Query => {
    return Query.query(state, entity, wrap)
  },

  /**
   * Get all data of given entity.
   */
  all: (state: RootState) => (entity: string, wrap?: boolean): Collection => {
    return Query.all(state, entity, wrap)
  },

  /**
   * Find a data of the given entity by given id.
   */
  find: (state: RootState) => (entity: string, id: string | number, wrap?: boolean): Item => {
    return Query.find(state, entity, id, wrap)
  }
}

export default RootGetters
