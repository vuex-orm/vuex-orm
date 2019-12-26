import { Store } from 'vuex'
import Item from '../data/Item'
import Collection from '../data/Collection'
import Query from '../query/Query'
import RootState from './contracts/RootState'
import GettersContract from './contracts/RootGetters'

const RootGetters: GettersContract = {
  /**
   * Create a new Query instance.
   */
  query (this: Store<any>, _state: RootState) {
    const database = this.$db()
    return (entity: string): Query => new Query(database, entity)
  },

  /**
   * Get all data of given entity.
   */
  all (this: Store<any>, _state: RootState) {
    const database = this.$db()
    return (entity: string): Collection => (new Query(database, entity)).all()
  },

  /**
   * Find a data of the given entity by given id.
   */
  find (this: Store<any>, _state: RootState) {
    const database = this.$db()
    return (entity: string, id: string | number | Array<any>): Item => {
      return (new Query(database, entity)).find(id)
    }
  },

  /**
   * Find a data of the given entity by given id.
   */
  findIn (this: Store<any>, _state: RootState) {
    const database = this.$db()
    return (entity: string, idList: Array<string | number | Array<any>>): Item[] => {
      return (new Query(database, entity)).findIn(idList)
    }
  }
}

export default RootGetters
