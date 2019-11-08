import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import DictionaryOne from '../contracts/DictionaryOne'
import Relation from './Relation'
import Utils from '../../support/Utils'

export default class BelongsTo extends Relation {
  /**
   * The parent model.
   */
  parent: typeof Model

  /**
   * The foregin key of the model.
   */
  foreignKey: string[]

  /**
   * The associated key on the parent model.
   */
  ownerKey: string

  /**
   * Create a new belongs to instance.
   */
  constructor (model: typeof Model, parent: typeof Model | string, foreignKey: string | string[], ownerKey: string) {
    super(model) /* istanbul ignore next */

    this.parent = this.model.relation(parent)

    this.foreignKey = Array.isArray(foreignKey) ? foreignKey : [foreignKey]

    this.ownerKey = ownerKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.one(this.parent)
  }

  /**
   * Attach the relational key to the given data. For example, when Post
   * belongs to User, it will attach value to the `user_id` field of
   * Post record.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    // See if the record has the foreign key, if yes, it means the user has
    // provided the key explicitly so do nothing and return.

    this.foreignKey.forEach((foreignKey, i) => {
      if (record[foreignKey] !== undefined) {
        return
      }

      const value = (typeof key === 'string') ? Utils.tryParseInt(key.split('_')[i]) : key

      // If there is no foreign key, let's set it here.
      record[foreignKey] = data[this.parent.entity] && data[this.parent.entity][value]
      ? data[this.parent.entity][value][this.ownerKey]
      : value
    })
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, _key: string): Model | null {
    return this.makeOneRelation(value, this.parent)
  }

  /**
   * Load the belongs to relationship for the collection.
   */
  load (query: Query, collection: Collection, name: string, constraints: Constraint[]): void {
    const relation = this.getRelation(query, this.parent.entity, constraints)

    this.addEagerConstraints(relation, collection)

    this.match(collection, relation.get(), name)
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  private addEagerConstraints (relation: Query, collection: Collection): void {
    relation.whereFk(this.ownerKey, this.getKeys(collection, this.foreignKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  private match (collection: Collection, relations: Collection, name: string): void {
    const dictionary = this.buildDictionary(relations)

    collection.forEach((model) => {
      const fKey = Utils.concatValues(model, this.foreignKey)

      const relation = dictionary[fKey]

      model[name] = relation || null
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  private buildDictionary (relations: Collection): DictionaryOne {
    return relations.reduce<DictionaryOne>((dictionary, relation) => {
      const key = relation[this.ownerKey]

      dictionary[key] = relation

      return dictionary
    }, {})
  }
}
