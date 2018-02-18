import Model from '../model/Model'
import Attrs, { Relation } from '../attributes/contracts/Contract'
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

      record = this.setId(record, model)

      record = this.generateMorphFields(record, parentValue, parent, attr)

      return record
    }
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
