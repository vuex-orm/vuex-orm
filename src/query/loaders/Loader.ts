import Collection from '../../data/Collection'
import Relation from '../../attributes/relations/Relation'
import Constraint from '../contracts/RelationshipConstraint'
import Query from '../Query'

export default class Loader {
  /**
   * Set the relationships that should be eager loaded with the query.
   */
  static with (query: Query, name: string | string[], constraint: Constraint | null): void {
    // If the name of the relation is `*`, we'll load all relationships.
    if (name === '*') {
      this.withAll(query)

      return
    }

    // If we passed an array, we dispatch the bits to with queries
    if (name instanceof Array) {
      name.forEach(relationName => this.with(query, relationName, constraint))
    } else {
      // Else parse relations and set appropriate constraints.
      this.parseWithRelations(query, name.split('.'), constraint)
    }
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
    // First we'll get the very first relationship from teh whole relations.
    const relation = relations[0]

    // If the first relation has "or" syntax which is `|` for example
    // `posts|videos`, set each of them as separate eager load.
    relation.split('|').forEach((name) => {
      // If there's only one relationship in relations array, that means
      // there's no nested relationship. So we'll set the given
      // constraint to the relationship loading.
      if (relations.length === 1) {
        this.setEagerLoad(query, name, constraint)

        return
      }

      // Else we'll skip adding constraint because the constraint has to be
      // applied to the nested relationship. We'll let `addNestedWiths`
      // method to handle that later.
      this.setEagerLoad(query, name)
    })

    // If the given relations only contains a single name, which means it
    // doesn't have any nested relations such as `posts.comments`, we
    // don't need go farther so return here.
    if (relations.length === 1) {
      return
    }

    // Finally, we shift the first relation from the array and handle lest
    // of relations as a nested relation.
    relations.shift()

    this.addNestedWiths(query, relation, relations, constraint)
  }

  /**
   * Parse the nested relationships in a relation.
   */
  private static addNestedWiths (query: Query, name: string, children: string[], constraint: Constraint | null): void {
    this.setEagerLoad(query, name, (nestedQuery) => {
      nestedQuery.with(children.join('.'), constraint)
    })
  }

  /**
   * Eager load the relationships for the given collection.
   */
  static eagerLoadRelations (query: Query, collection: Collection): void {
    const fields = query.model.getFields()

    for (const name in query.load) {
      const constraints = query.load[name]
      const relation = fields[name]

      if (relation instanceof Relation) {
        relation.load(query, collection, name, constraints)
      }
    }
  }
}
