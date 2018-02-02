import Container from '../../connections/Container'
import { Record } from '../../Data'
import Model from '../../Model'
import { Item, Collection } from '../Query'
import Repo, { Relation as Load } from '../Repo'

export default abstract class Relation {
  /**
   * Resolve model out of container.
   */
  model (model: typeof Model | string, connection: string = 'entities'): typeof Model {
    if (typeof model !== 'string') {
      return model
    }

    return Container.connection(connection).model(model)
  }

  /**
   * Make model instances of the relation.
   */
  abstract make (): Model | Model[] | null

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
