import Utils from '../../support/Utils'
import { Records, NormalizedData, Item, Collection } from '../../data/Contract'
import Query from '../Query'

export default class Persist {
  /**
   * The query instance.
   */
  query: Query

  /**
   * The data to be persisted to the store.
   */
  data: NormalizedData

  /**
   * The persist method.
   */
  method: string

  /**
   * List of entities that should be force created.
   */
  forceCreateFor: string[]

  /**
   * List of entities that should be force inserted.
   */
  forceInsertFor: string[]

  /**
   * Whether should return many record or single.
   */
  many: boolean

  /**
   * Create a new persist instance.
   */
  constructor (query: Query, method: string, data: NormalizedData, forceCreateFor: string[] = [], forceInsertFor: string[] = [], many: boolean = true) {
    this.query = query
    this.method = method
    this.data = data
    this.forceCreateFor = forceCreateFor
    this.forceInsertFor = forceInsertFor
    this.many = many
  }

  /**
   * Persist data to the store.
   */
  process (): Item | Collection {
    if (Utils.isEmpty(this.data)) {
      if (this.method === 'create') {
        this.query.state.data = {}
      }

      return this.many ? [] : null
    }

    return this.saveEach()
  }

  /**
   * Save each entities to its own dedicated store.
   */
  saveEach (): Item | Collection {
    Utils.forOwn(this.data, (records, entity) => {
      const method = this.getMethod(entity)
      const filledRecords = this.query.getModel(entity).fillMany(records, ['$id'])

      this[method](entity, filledRecords)
    })

    const entities = this.data[this.query.entity]

    const collection = Object.keys(entities).map(id => entities[id])

    return this.many ? this.query.collect(collection) : this.query.item(collection[0])
  }

  /**
   * Get method for persist.
   */
  getMethod (entity: string): string {
    if (this.forceCreateFor.includes(entity)) {
      return 'create'
    }

    if (this.forceInsertFor.includes(entity)) {
      return 'insert'
    }

    return this.method
  }

  /**
   * Persist data by removing any existing data.
   */
  create (entity: string, data: Records): void {
    const state = this.query.rootState[entity]

    state.data = data
  }

  /**
   * Persist data by keeping any existing data.
   */
  insert (entity: string, data: Records): void {
    const state = this.query.rootState[entity]

    state.data = { ...state.data, ...data }
  }
}
