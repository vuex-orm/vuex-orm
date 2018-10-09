import Collection from '../../data/Collection'
import Relation from '../../attributes/relations/Relation'
import Constraint from '../options/Constraint'
import Query from '../Query'

export default class Loader {
  /**
   * Set eager load relation and constraint.
   */
  static setEagerLoad (query: Query, relation: string, constraint: Constraint | null = null): void {
    if (!query.load[relation]) {
      query.load[relation] = []
    }

    constraint && query.load[relation].push(constraint)
  }

  /**
   * Set the relationships that should be loaded.
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
   * Query all relations.
   */
  static withAll (query: Query, constraint: Constraint = () => null): void {
    const fields = query.model.getFields()

    for (const field in query.model.getFields()) {
      fields[field] instanceof Relation && this.with(query, field, constraint)
    }
  }

  /**
   * Query all relations recursively.
   */
  static withAllRecursive (query: Query, depth: number): void {
    this.withAll(query, (relatedQuery) => {
      depth > 0 && relatedQuery.withAllRecursive(depth - 1)
    })
  }

  /**
   * Parse a list of relations into individuals.
   */
  static parseWithRelations (query: Query, relations: string[], constraint: Constraint | null): void {
    const relation = relations[0]

    relation.split('|').forEach((name) => {
      this.setEagerLoad(query, name)
    })

    if (relations.length === 1) {
      this.setEagerLoad(query, relation, constraint)

      return
    }

    relations.shift()

    this.addNestedWiths(query, relations, constraint)
  }

  /**
   * Parse the nested relationships in a relation.
   */
  static addNestedWiths (query: Query, relations: string[], constraint: Constraint | null): void {
    const relation = relations.join('.')

    this.setEagerLoad(query, relation, (nestedQuery) => {
      nestedQuery.with(relation, constraint)
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
