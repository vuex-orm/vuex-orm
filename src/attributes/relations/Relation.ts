import { Schema as NormalizrSchema } from 'normalizr'
import { isArray } from '../../support/Utils'
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
  abstract define(schema: Schema): NormalizrSchema

  /**
   * Attach the relational key to the given data. Basically, this method
   * should attach any missing foreign keys to the normalized data.
   */
  abstract attach(key: any, record: Record, data: NormalizedData): void

  /**
   * Load relationship records.
   */
  abstract load(
    query: Query,
    collection: Collection,
    name: string,
    constraints: Constraint[]
  ): void

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  abstract make(value: any, parent: Record, key: string): Model | Model[] | null

  /**
   * Get relation query instance with constraint attached.
   */
  protected getRelation(
    query: Query,
    name: string,
    constraints: Constraint[]
  ): Query {
    const relation = query.newQuery(name)

    constraints.forEach((constraint) => {
      constraint(relation)
    })

    return relation
  }

  /**
   * Get specified keys from the given collection.
   */
  protected getKeys(collection: Collection, key: string): string[] {
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
  mapSingleRelations(collection: Record[], key: string): Map<string, Record> {
    const relations = new Map<string, Record>()

    collection.forEach((record) => {
      const id = record[key]

      !relations.get(id) && relations.set(id, record)
    })

    return relations
  }

  /**
   * Create a new indexed map for the many relation by specified key.
   */
  mapManyRelations(collection: Record[], key: string): Map<string, Record> {
    const relations = new Map<string, Record>()

    collection.forEach((record) => {
      const id = record[key]

      let ownerKeys = relations.get(id)

      if (!ownerKeys) {
        ownerKeys = []
        relations.set(id, ownerKeys)
      }

      ownerKeys.push(record)
    })

    return relations
  }

  /**
   * Create a new indexed map for relations with order constraints.
   */
  mapRelationsByOrders(
    collection: Collection,
    relations: Map<string, Record>,
    ownerKey: string,
    relationKey: string
  ): Records {
    const records: Records = {}

    relations.forEach((related, id) => {
      collection
        .filter((record) => record[relationKey] === id)
        .forEach((record) => {
          const id = record[ownerKey]

          if (!records[id]) {
            records[id] = []
          }

          records[id] = records[id].concat(related)
        })
    })

    return records
  }

  /**
   * Check if the given record is a single relation, which is an object.
   */
  isOneRelation(record: any): boolean {
    if (!isArray(record) && record !== null && typeof record === 'object' && !this.isNormalizedPolymorphicObject(record)) {
      return true
    }

    return false
  }

  /**
   * Check if the given record is a normalized polymorphic object returned
   * from normalizr and has exactly this object schema: { id, schema }
   */
  isNormalizedPolymorphicObject(record: any): boolean {
    return Object.keys(record).toString() == 'id,schema'
  }

  /**
   * Check if the given records is a many relation, which is an array
   * of object.
   */
  isManyRelation(records: any): boolean {
    if (!isArray(records)) {
      return false
    }

    if (records.length < 1) {
      return false
    }

    return true
  }

  /**
   * Wrap the given object into a model instance.
   */
  makeOneRelation(record: any, model: typeof Model): Model | null {
    if (!this.isOneRelation(record)) {
      return null
    }

    const relatedModel = model.getModelFromRecord(record) || model

    return new relatedModel(record)
  }

  /**
   * Wrap the given records into a collection of model instances.
   */
  makeManyRelation(records: any, model: typeof Model): Collection {
    if (!this.isManyRelation(records)) {
      return []
    }

    return records
      .filter((record: any) => {
        return this.isOneRelation(record)
      })
      .map((record: Record) => {
        const relatedModel = model.getModelFromRecord(record) || model

        return new relatedModel(record)
      })
  }
}
