import Model from '../../model/Model'
import Attrs, { Relation } from '../../attributes/contracts/Contract'
import Record from '../../data/Record'
import NoKey from './NoKey'

export type Strategy = (value: any, parent: any, key: string) => any

export default class ProcessStrategy {
  /**
   * Create the process strategy.
   */
  static create (noKey: NoKey, model: typeof Model, parent?: typeof Model, attr?: Relation): Strategy {
    return (value: any, parentValue: any, key: string) => {
      let record: Record = { ...value }

      record = this.setId(record, model, noKey, key)

      record = this.generateMorphFields(record, parentValue, parent, attr)

      return record
    }
  }

  /**
   * Set id field to the record.
   */
  static setId (record: Record, model: typeof Model, noKey: NoKey, key: string): Record {
    const id = model.id(record)

    return { ...record, $id: id !== undefined ? id : noKey.increment(key) }
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
