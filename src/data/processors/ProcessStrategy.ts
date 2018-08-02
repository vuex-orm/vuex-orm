import Utils from '../../support/Utils'
import BaseModel from '../../model/BaseModel'
import Attrs, { Fields, Relation } from '../../attributes/contracts/Contract'
import Attribute from '../../attributes/Attribute'
import Record from '../Record'
import NoKey from './NoKey'

export type Strategy = (value: any, parent: any, key: string) => any

export default class ProcessStrategy {
  /**
   * Create the process strategy.
   */
  static create (noKey: NoKey, model: typeof BaseModel, parent?: typeof BaseModel, attr?: Relation): Strategy {
    return (value: any, parentValue: any, key: string) => {
      let record: Record = { ...value }

      record = this.fix(record, model)

      record = this.setId(record, model, noKey, key)

      record = this.generateMorphFields(record, parentValue, parent, attr)

      return record
    }
  }

  /**
   * Normalize individual records.
   */
  static fix (record: Record, model: typeof BaseModel): Record {
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
        newRecord[key] = field.fill(record[key])

        return
      }

      newRecord[key] = this.processFix(record[key], field)
    })

    return newRecord
  }

  /**
   * Set id field to the record.
   */
  static setId (record: Record, model: typeof BaseModel, noKey: NoKey, key: string): Record {
    const id = model.id(record)

    return { ...record, $id: id !== undefined ? id : noKey.increment(key) }
  }

  /**
   * Generate morph fields. This method will generate fileds needed for the
   * morph fields such as `commentable_id` and `commentable_type`.
   */
  static generateMorphFields (record: Record, parentValue: any, parent?: typeof BaseModel, attr?: Relation): Record {
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
