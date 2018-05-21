import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query, { Relation as Load } from '../../query/Query'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class MorphTo extends Relation {
  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name fthat contains type of the parent model.
   */
  type: string

  /**
   * Create a new morph to instance.
   */
  constructor (model: typeof Model, id: string, type: string) {
    super(model) /* istanbul ignore next */

    this.id = id
    this.type = type
  }

  /**
   * Validate the given value to be a valid value for the relationship.
   */
  fill (value: any): string | number | null {
    return this.fillOne(value)
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, parent: Record, _key: string, plain: boolean = false): Model | Record | null {
    if (value === null) {
      return null
    }

    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    const related: string = parent[this.type]
    const model = this.model.relation(related)

    return model ? model.make(value, plain) : null
  }

  /**
   * Attach the relational key to the given record.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Load the morph many relationship for the record.
   */
  load (query: Query, collection: Record[], relation: Load): Record[] {
    const relatedRecords = Object.keys(query.getModels()).reduce((records, name) => {
      if (name === query.entity) {
        return records
      }

      const relatedQuery = new Query(query.rootState, name, false)

      this.addConstraint(relatedQuery, relation)

      records[name] = this.mapRecords(relatedQuery.get(), '$id')

      return records
    }, {} as { [name: string]: { [id: string]: any } })

    const relatedPath = this.relatedPath(relation.name)

    return collection.map((item) => {
      const related = relatedRecords[item[this.type]][item[this.id]]

      return this.setRelated(item, related || null, relatedPath)
    })
  }
}
