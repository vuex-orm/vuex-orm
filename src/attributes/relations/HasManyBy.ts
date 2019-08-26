import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import DictionaryOne from '../contracts/DictionaryOne'
import Relation from './Relation'

export default class HasManyBy extends Relation {
  /**
   * The related model.
   */
  parent: typeof Model

  /**
   * The foregin key of the model.
   */
  foreignKey: string

  /**
   * The associated key on the parent model.
   */
  ownerKey: string

  /**
   * Create a new has many by instance.
   */
  constructor (model: typeof Model, parent: typeof Model | string, foreignKey: string, ownerKey: string) {
    super(model) /* istanbul ignore next */

    this.parent = this.model.relation(parent)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.parent)
  }

  /**
   * Attach the relational key to the given data.
   */
  attach (key: any, record: Record, _data: NormalizedData): void {
    if (key === undefined || key === null) {
      return
    }

    if (key.length === 0) {
      return
    }

    if (record[this.foreignKey] !== undefined) {
      return
    }

    record[this.foreignKey] = key
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, _key: string): Model[] | Record[] {
    return this.makeManyRelation(value, this.parent)
  }

  /**
   * Load the has many by relationship for the collection.
   */
  load (query: Query, collection: Collection, name: string, constraints: Constraint[]): void {
    const relatedQuery = this.getRelation(query, this.parent.entity, constraints)

    this.addConstraintForHasManyBy(relatedQuery, collection)

    const relations = this.mapSingleRelations(relatedQuery.get(), this.ownerKey) as DictionaryOne

    collection.forEach((item) => {
      const related = this.getRelatedRecords(relations, item[this.foreignKey])

      item[name] = related
    })
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addConstraintForHasManyBy (query: Query, collection: Collection): void {
    const keys = collection.reduce<string[]>((keys, item) => {
      return keys.concat(item[this.foreignKey])
    }, [] as string[])

    query.where(this.ownerKey, keys)
  }

  /**
   * Get related records.
   */
  getRelatedRecords (records: DictionaryOne, keys: string[]): Collection {
    return keys.reduce<Collection>((items, id) => {
      const related = records[id]

      related && items.push(related)

      return items
    }, [])
  }
}
