import { Record, NormalizedData } from '../../data'
import Model from '../../model/Model'
import Query, { Relation as Load } from '../../query/Query'
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
   * Validate the given value to be a valid value for the relationship.
   */
  fill (value: any): (string | number)[] {
    return this.fillMany(value)
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, _parent: Record, _key: string, plain: boolean = false): Model[] | Record[] {
    if (value === null) {
      return []
    }

    if (value === undefined) {
      return []
    }

    if (!Array.isArray(value)) {
      return []
    }

    if (value.length === 0) {
      return []
    }

    return value.filter((record) => {
      return record && typeof record === 'object'
    }).map((record) => {
      return this.parent.make(record, plain)
    })
  }

  /**
   * Attach the relational key to the given record.
   */
  attach (key: any, record: Record, _data: NormalizedData): void {
    if (key.length === 0) {
      return
    }
    if (record[this.foreignKey] !== undefined) {
      return
    }

    record[this.foreignKey] = key
  }

  /**
   * Load the has many by relationship for the record.
   */
  load (query: Query, collection: Record[], relation: Load): Record[] {
    const relatedPath = this.relatedPath(relation.name)

    const relatedQuery = query.newPlainQuery(this.parent.entity)

    this.addConstraint(relatedQuery, relation)

    const relatedRecords = this.mapRecords(relatedQuery.get(), this.ownerKey)

    return collection.map((item) => {
      const related = item[relation.name].reduce((related: Record[], id: any) => {
        if (relatedRecords[id]) {
          related.push(relatedRecords[id])
        }

        return related
      }, [])

      return this.setRelated(item, related, relatedPath)
    })
  }
}
