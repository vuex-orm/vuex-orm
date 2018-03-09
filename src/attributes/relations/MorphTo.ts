import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
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
    super(model)

    this.id = id
    this.type = type
  }

  /**
   * Transform given data to the appropriate value. This method will be called
   * during data normalization to fix field that has an incorrect value,
   * or add a missing field with the appropriate default value.
   */
  fill (value: any): string | number | null | Record {
    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return null
    }

    return value
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make (value: any, parent: Record, _key: string): Model | null {
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

    return model ? new model(value) : null
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
  load (repo: Repo, collection: PlainCollection, relation: Load): PlainCollection {
    const relatedRecords = Object.keys(repo.models()).reduce((records, name) => {
      if (name === repo.name) {
        return records
      }

      const query = new Repo(repo.state, name, false)

      this.addConstraint(query, relation)

      records[name] = this.mapRecords(query.get(), '$id')

      return records
    }, {} as { [name: string]: { [id: string]: any } })

    const relatedPath = this.relatedPath(relation.name)

    return collection.map((item) => {
      const related = relatedRecords[item[this.type]][item[this.id]]

      return this.setRelated(item, related || null, relatedPath)
    })
  }
}
