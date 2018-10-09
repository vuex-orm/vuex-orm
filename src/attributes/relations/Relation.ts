import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData } from '../../data'
import Query from '../../query/Query'
import Attribute from '../Attribute'

export default abstract class Relation extends Attribute {
  /**
   * Define the normalizr schema for the relationship.
   */
  abstract define (schema: Schema): NormalizrSchema

  /**
   * Attach the relational key to the given data. Basically, this method
   * should attach any missing foreign keys to the normalized data.
   */
  abstract attach (key: any, record: Record, data: NormalizedData): void

  /**
   * Load relationship records.
   */
  abstract load (query: Query, collection: Record[], key: string): void

  /**
   * Get relation query instance with constraint attached.
   */
  getRelation (query: Query, name: string): Query {
    const relation = query.newPlainQuery(name)

    this.addEagerConstraint(query, relation)

    return relation
  }

  /**
   * Get specified keys from the given collection.
   */
  getKeys (collection: Record[], key: string): string[] {
    return collection.map(item => item[key])
  }

  /**
   * Add eager load constraint to the query.
   */
  addEagerConstraint (query: Query, relation: Query): void {
    for (const name in query.load) {
      query.load[name].forEach(constraint => { constraint(relation) })
    }
  }

  /**
   * Create a new indexed map for the single relation by specified key.
   */
  mapSingleRelations (collection: Record[], key: string): Records {
    return collection.reduce((records, record) => {
      const id = record[key]

      records[id] = record

      return records
    }, {} as Records)
  }

  /**
   * Create a new indexed map for the many relation by specified key.
   */
  mapManyRelations (collection: Record[], key: string): Records {
    return collection.reduce((records, record) => {
      const id = record[key]

      if (!records[id]) {
        records[id] = []
      }

      records[id].push(record)

      return records
    }, {} as Records)
  }

  /**
   * Check if the given value is a single relation, which is the Object.
   */
  isOneRelation (record: any): boolean {
    if (!Array.isArray(record) && record !== null && typeof record === 'object') {
      return true
    }

    return false
  }
}
