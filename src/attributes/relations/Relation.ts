import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
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
  abstract load (query: Query, collection: Collection, name: string, constraints: Constraint[]): void

  /**
   * Get relation query instance with constraint attached.
   */
  protected getRelation (query: Query, name: string, constraints: Constraint[]): Query {
    const relation = query.newQuery(name)

    constraints.forEach(constraint => { constraint(relation) })

    return relation
  }

  /**
   * Get specified keys from the given collection.
   */
  protected getKeys (collection: Collection, key: string): string[] {
    return collection.reduce<string[]>((models, model) => {
      if (model[key] === null || model[key] === undefined) {
        return models
      }

      models.push(model[key] as string)

      return models
    }, [])
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

  /**
   * Check if the given value is a single relation, which is the Object.
   */
  isManyRelation (records: any): boolean {
    if (!Array.isArray(records)) {
      return false
    }

    if (records.length < 1) {
      return false
    }

    return true
  }

  /**
   * Convert given records to the collection.
   */
  makeManyRelation (records: any, model: typeof Model): Collection {
    if (!this.isManyRelation(records)) {
      return []
    }

    return records.filter((record: any) => {
      return this.isOneRelation(record)
    }).map((record: Record) => {
      return new model(record)
    })
  }
}
