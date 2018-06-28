import { Schema as NormalizrSchema } from 'normalizr'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData } from '../../data'
import Fields from '../../model/Fields'
import Query, { Relation as Load } from '../../query/Query'
import Attribute from '../Attribute'

export default abstract class Relation extends Attribute {
  /**
   * Define the normalizr schema for the relationship.
   */
  abstract define (schema: Schema): NormalizrSchema

  /**
   * Fill given value for the single item relationship such as
   * `hasOne` and `belongsTo`.
   */
  fillOne (value: any): string | number | null {
    if (value === undefined) {
      return null
    }

    if (typeof value === 'object') {
      return null
    }

    return value
  }

  /**
   * Fill given value for the multi-item relationship such as
   * `hasMany` and `belongsToMany`.
   */
  fillMany (value: any): (string | number)[] {
    return Array.isArray(value) ? value : []
  }

  /**
   * Attach the relational key to the given record.
   */
  abstract attach (key: any, record: Record, data: NormalizedData): void

  /**
   * Load relationship records.
   */
  abstract load (query: Query, collection: Record[], relation: Load): Record[]

  /**
   * Check if the given value is a single relation, which is the Object.
   */
  isOneRelation (record: any): boolean {
    if (!Array.isArray(record) && record !== null && typeof record === 'object') {
      return true
    }

    return false
  }

  /**
   * Create a new map of the record by given key.
   */
  mapRecords (records: Record[], key: string): Records {
    return records.reduce((records, record) => {
      return { ...records, [record[key]]: record }
    }, {} as Records)
  }

  /**
   * Get the path of the related field. It returns path as a dot-separated
   * string something like `settings.accounts`.
   */
  relatedPath (key: string, fields?: Fields, parent?: string): string {
    const _key = key.split('.')[0]
    const _fields = fields || this.model.fields()

    let path = ''

    Object.keys(_fields).some((name) => {
      if (name === _key) {
        path = parent ? `${parent}.${_key}` : _key

        return true
      }

      const field = _fields[name]

      if (field instanceof Attribute) {
        return false
      }

      const parentPath = parent ? `${parent}.${name}` : name
      const nestedPath = this.relatedPath(_key, field, parentPath)

      if (!nestedPath) {
        return false
      }

      path = nestedPath

      return true
    })

    return path
  }

  /**
   * Set given related records to the item.
   */
  setRelated (item: Record, related: Record | Record[] | null, path: string): Record {
    const paths = path.split('.')
    const length = paths.length - 1

    let schema = item

    for (let i = 0; i < length; i++) {
      schema = schema[paths[i]]
    }

    schema[paths[length]] = related

    return item
  }

  /**
   * Add constraint to the query.
   */
  addConstraint (query: Query, relation: Load): void {
    const relations = relation.name.split('.')

    if (relations.length !== 1) {
      relations.shift()

      if (relations.length > 1) {
        query.with(relations.join('.'))
      } else {
        if (relations[0] === '*') {
          query.withAll()
        } else {
          for (const relation of relations[0].split('|')) {
            query.with(relation)
          }
        }
      }

      return
    }

    const result = relation.constraint && relation.constraint(query)

    if (typeof result === 'boolean') {
      query.where(() => result)
    }
  }
}
