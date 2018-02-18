import Container from '../../connections/Container'
import { Record } from '../../data/Contract'
import Model from '../../model/Model'
import { Item, Collection } from '../../repo/Query'
import Repo, { Relation as Load } from '../../repo/Repo'
import { Fields } from '../contracts/Contract'
import Attribute from '../Attribute'

export default abstract class Relation extends Attribute {
  /**
   * The name of the connection.
   */
  connection: string

  /**
   * Create a relation instance.
   */
  constructor (connection: string = 'entities') {
    super()

    this.connection = connection
  }

  /**
   * Resolve model out of container.
   */
  model (model: typeof Model | string): typeof Model {
    if (typeof model !== 'string') {
      return model
    }

    return Container.connection(this.connection).model(model)
  }

  /**
   * Make model instances of the relation.
   */
  abstract make (parent: Fields): Model | Model[] | null

  /**
   * Load relationship records.
   */
  abstract load (repo: Repo, record: Record, relation: Load): Item | Collection

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
