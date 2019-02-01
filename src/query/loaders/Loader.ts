import Collection from '../../data/Collection'
import Relation from '../../attributes/relations/Relation'
import Constraint from '../options/Constraint'
import Query from '../Query'

export default class Loader {
  /**
   * Set the relationships that should be eager loaded with the query.
   */
  static with (query: Query, name: string, constraint: Constraint | null): void {
    // If the name of the relation is `*`, we'll load all relationships.
    if (name === '*') {
      this.withAll(query)

      return
    }

    // Else parse relations and set appropriate constraints.
    this.parseWithRelations(query, name.split('.'), constraint)
  }

  /**
   * Set all relationships to be eager loaded with the query.
   */
  static withAll (query: Query, constraint: Constraint = () => null): void {
    const fields = query.model.getFields()

    for (const field in fields) {
      fields[field] instanceof Relation && this.with(query, field, constraint)
    }
  }

  /**
   * Set relationships to be recursively eager loaded with the query.
   */
  static withAllRecursive (query: Query, depth: number): void {
    this.withAll(query, (relatedQuery) => {
      depth > 0 && relatedQuery.withAllRecursive(depth - 1)
    })
  }

  /**
   * Set eager load relation and constraint.
   */
  private static setEagerLoad (query: Query, name: string, constraint: Constraint | null = null): void {
    if (!query.load[name]) {
      query.load[name] = []
    }

    constraint && query.load[name].push(constraint)
  }

  /**
   * Parse a list of relations into individuals.
   */
  private static parseWithRelations (query: Query, relations: string[], constraint: Constraint | null): void {
    // If the first relation has "or" syntax which is `|` for example
    // `posts|videos`, set each of them as separate eager load.
    relations[0].split('|').forEach((name) => {
      this.setEagerLoad(query, name)

      return
    })

    // If the given relations only contains a single name, which means it
    // doesn't have any nested relations such as `posts.comments`, we'll
    // just set the relation as an eager load.
    if (relations.length === 1) {
      this.setEagerLoad(query, relations[0], constraint)

      return
    }

    // Finally, we shift the first relation from the array and handle lest
    // of relations as a nested relation.
    relations.shift()

    this.addNestedWiths(query, relations, constraint)
  }

  /**
   * Parse the nested relationships in a relation.
   */
  private static addNestedWiths (query: Query, relations: string[], constraint: Constraint | null): void {
    const name = relations.join('.')

    this.setEagerLoad(query, name, (nestedQuery) => {
      nestedQuery.with(name, constraint)
    })
  }

  /**
   * Eager load the relationships for the given collection.
   */
  static eagerLoadRelations (query: Query, collection: Collection): void {
    const fields = query.model.getFields()

    for (const name in query.load) {
      const relation = fields[name]

      if (relation instanceof Relation) {
        relation.load(query, collection, name)
      }
    }
  }
}
