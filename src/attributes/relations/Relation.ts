import { Record, NormalizedData, PlainItem, PlainCollection } from '../../data/Contract'
import Repo, { Relation as Load } from '../../repo/Repo'
import Attribute from '../Attribute'

export default abstract class Relation extends Attribute {
  /**
   * Attach the relational key to the given record.
   */
  abstract attach (key: any, record: Record, data: NormalizedData): void

  /**
   * Load relationship records.
   */
  abstract load (repo: Repo, record: Record, relation: Load): PlainItem | PlainCollection

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
