import { Record, Records, NormalizedData, PlainItem, PlainCollection } from '../../data/Contract'
import Repo, { Relation as Load } from '../../repo/Repo'
import { Fields } from '../contracts/Contract'
import Attribute from '../Attribute'

export default abstract class Relation extends Attribute {
  /**
   * Attach the relational key to the given record.
   */
  abstract attach (key: any, record: Record, data: NormalizedData): void

  /**
   * Load relationship records.
   */
  abstract load (repo: Repo, collection: PlainCollection, relation: Load): PlainItem | PlainCollection

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
  setRelated (item: Record, related: PlainItem | PlainCollection, path: string): Record {
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
  addConstraint (query: Repo, relation: Load): void {
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
