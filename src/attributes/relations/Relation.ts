import { Record, PlainItem, PlainCollection } from '../../data/Contract'
import Repo, { Relation as Load } from '../../repo/Repo'
import Attribute from '../Attribute'

export default abstract class Relation extends Attribute {
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

      query.with(relations.join('.'))

      return
    }

    const result = relation.constraint && relation.constraint(query)

    if (typeof result === 'boolean') {
      query.where(() => result)
    }
  }
}
