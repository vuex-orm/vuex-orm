import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphTo extends Relation {
  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name that contains type of the parent model.
   */
  type: string

  /**
   * Create a new morph to instance.
   */
  constructor(model: typeof Model, id: string, type: string) {
    super(model) /* istanbul ignore next */

    this.id = id
    this.type = type
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.union((_value, parentValue) => parentValue[this.type])
  }

  /**
   * Attach the relational key to the given record. Since morph to
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach(_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(value: any, parent: Record, _key: string): Model | null {
    const related = parent[this.type] as string

    try {
      const model = this.model.relation(related)
      return this.makeOneRelation(value, model)
    } catch {
      return null
    }
  }

  /**
   * Load the morph to relationship for the collection.
   */
  load(
    query: Query,
    collection: Collection,
    name: string,
    constraints: Constraint[]
  ): void {
    const types = this.getTypes(collection)

    const relations = types.reduce((related, type) => {
      const relatedQuery = this.getRelation(query, type, constraints)

      related[type] = this.mapSingleRelations(relatedQuery.get(), '$id')

      return related
    }, {})

    collection.forEach((item) => {
      const id = item[this.id]
      const type = item[this.type]
      const related = relations[type].get(String(id))

      item[name] = related || null
    })
  }

  /**
   * Get all types from the collection.
   */
  getTypes(collection: Collection): string[] {
    return collection.reduce<string[]>((types, item) => {
      const type = item[this.type]

      !types.includes(type) && types.push(type)

      return types
    }, [] as string[])
  }
}
