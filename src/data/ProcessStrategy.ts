import Utils from '../support/Utils'
import Model from '../model/Model'
import Attrs, { Fields, Relation } from '../attributes/contracts/Contract'
import Attribute from '../attributes/Attribute'
import { Record } from './Contract'

export type Strategy = (value: any, parent: any, key: string) => any

export default class ProcessStrategy {
  /**
   * Count to create a unique id for the record that missing its primary key.
   */
  static count: number = 0

  /**
   * Prefix string to be used for undefined primary key value.
   */
  static prefix: string = '_no_key_'

  /**
   * Create the process strategy.
   */
  static create (model: typeof Model, parent?: typeof Model, attr?: Relation): Strategy {
    return (value: any, parentValue: any, _key: string) => {
      let record: Record = { ...value }

      record = this.fix(record, model)

      record = this.setId(record, model)

      record = this.generateMorphFields(record, parentValue, parent, attr)

      return record
    }
  }

  /**
   * Normalize individual records.
   */
  static fix (record: Record, model: typeof Model): Record {
    return this.processFix(record, model.fields())
  }

  /**
   * Normalize individual records.
   */
  static processFix (record: Record = {}, fields: Fields): Record {
    let newRecord: Record = {}

    Utils.forOwn(fields, (field, key) => {
      if (record[key] === undefined) {
        return
      }

      if (field instanceof Attribute) {
        newRecord[key] = field.normalize(record[key])

        return
      }

      newRecord[key] = this.processFix(record[key], field)
    })

    return newRecord
  }

  /**
   * Set id field to the record.
   */
  static setId (record: Record, model: typeof Model): Record {
    const id = model.id(record)

    return { ...record, $id: id === undefined ? this.noKey(true) : id }
  }

  /**
   * Get string to be used for undefined primary key/
   */
  static noKey (increment: boolean = false): string {
    if (increment) {
      this.count++
    }

    return `_no_key_${this.count}`
  }

  /**
   * Generate morph fields. This method will generate fileds needed for the
   * morph fields such as `commentable_id` and `commentable_type`.
   */
  static generateMorphFields (record: Record, parentValue: any, parent?: typeof Model, attr?: Relation): Record {
    if (attr === undefined) {
      return record
    }

    if (!Attrs.isMorphRelation(attr)) {
      return record
    }

    if (parent === undefined) {
      return record
    }

    return {
      [attr.id]: parentValue.$id,
      [attr.type]: parent.entity,
      ...record
    }
  }
}
