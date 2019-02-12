import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import DictionaryOne from '../contracts/DictionaryOne'
import Relation from './Relation'

export default class BelongsTo extends Relation {
  /**
   * The parent model.
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
   * Create a new belongs to instance.
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
    return schema.one(this.parent)
  }

  /**
   * Attach the relational key to the given data. For example,
   * when Post belongs to User, it will attach value to the
   * `user_id` field of Post record.
   */
  attach (key: any, record: Record, _data: NormalizedData): void {
    // See if the record has the foreign key, if yes, it means the user has
    // provided the key explicitly so do nothing and return.
    if (record[this.foreignKey] !== undefined) {
      return
    }

    // If there is no foreign key, let's set it here.
    record[this.foreignKey] = key
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (value: any, _parent: Record, _key: string): Model | null {
    if (!this.isOneRelation(value)) {
      return null
    }

    return new this.parent(value)
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
      const id = model[this.foreignKey]
      const relation = id !== null ? dictionary[id] : null

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
