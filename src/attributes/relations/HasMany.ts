import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import DictionaryMany from '../contracts/DictionaryMany'
import Relation from './Relation'

export default class HasMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The foreign key of the related model.
   */
  foreignKey: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * Create a new has many instance.
   */
  constructor(
    model: typeof Model,
    related: typeof Model | string,
    foreignKey: string,
    localKey: string
  ) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.foreignKey = foreignKey
    this.localKey = localKey
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given data.
   */
  attach (key: any, record: Record, data: NormalizedData): void {
    key.forEach((parent: any) => {
      let relatedRecord = typeof parent === 'object' ? data[parent.schema][parent.id] : data[this.related.entity][parent]

      if (!relatedRecord || relatedRecord[this.foreignKey] !== undefined ) return

      relatedRecord[this.foreignKey] = record[this.localKey]
    })
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, _parent: Record, _key: string): Model[] {
    return this.makeManyRelation(value, this.related)
  }

  /**
   * Load the has many relationship for the collection.
   */
  load(
    query: Query,
    collection: Collection,
    name: string,
    constraints: Constraint[]
  ): void {
    const relation = this.getRelation(query, this.related.entity, constraints)

    this.addEagerConstraints(relation, collection)

    this.match(collection, relation.get(), name)
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  private addEagerConstraints(relation: Query, collection: Collection): void {
    relation.whereFk(this.foreignKey, this.getKeys(collection, this.localKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  private match(
    collection: Collection,
    relations: Collection,
    name: string
  ): void {
    const dictionary = this.buildDictionary(relations)

    collection.forEach((model) => {
      const id = model[this.localKey]
      const relation = dictionary[id]

      model[name] = relation || []
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  private buildDictionary(relations: Collection): DictionaryMany {
    return relations.reduce<DictionaryMany>((dictionary, relation) => {
      const key = relation[this.foreignKey]

      if (!dictionary[key]) {
        dictionary[key] = []
      }

      dictionary[key].push(relation)

      return dictionary
    }, {})
  }
}
