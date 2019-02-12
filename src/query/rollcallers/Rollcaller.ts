import Item from '../../data/Item'
import Collection from '../../data/Collection'
import Model from '../../model/Model'
import Predicate from '../contracts/Predicate'
import Has from '../options/Has'
import HasConstraint from '../options/HasConstraint'
import Query from '../Query'

export default class Rollcaller {
  /**
   * Set where constraint based on relationship existence.
   */
  static has (query: Query, relation: string, operator?: string | number, count?: number): void {
    this.setHas(query, relation, 'exists', operator, count)
  }

  /**
   * Set where constraint based on relationship absence.
   */
  static hasNot (query: Query, relation: string, operator?: string | number, count?: number): void {
    this.setHas(query, relation, 'doesntExist', operator, count)
  }

  /**
   * Add where has condition.
   */
  static whereHas (query: Query, relation: string, constraint: HasConstraint): void {
    this.setHas(query, relation, 'exists', undefined, undefined, constraint)
  }

  /**
   * Add where has not condition.
   */
  static whereHasNot (query: Query, relation: string, constraint: HasConstraint): void {
    this.setHas(query, relation, 'doesntExist', undefined, undefined, constraint)
  }

  /**
   * Set `has` condition.
   */
  private static setHas (query: Query, relation: string, type: string, operator: string | number = '>=', count: number = 1, constraint: HasConstraint | null = null): void {
    if (typeof operator === 'number') {
      query.have.push({ relation, type, operator: '>=', count: operator, constraint })

      return
    }

    query.have.push({ relation, type, operator, count, constraint })
  }

  /**
   * Convert `has` conditions to where clause. It will check any relationship
   * existence, or absence for the records then set ids of the records that
   * matched the condition to `where` clause.
   *
   * This way, when the query gets executed, only those records that matched
   * the `has` condition get retrieved. In the future, once relationship index
   * mapping is implemented, we can simply do all checks inside the where
   * filter since we can treat `has` condition as usual `where` condition.
   *
   * For now, since we must fetch any relationship by eager loading them, due
   * to performance concern, we'll apply `has` conditions this way to gain
   * maximum performance.
   */
  static applyConstraints (query: Query): void {
    if (query.have.length === 0) {
      return
    }

    const newQuery = query.newQuery()

    this.addHasWhereConstraints(query, newQuery)

    this.addHasConstraints(query, newQuery.get())
  }

  /**
   * Add has constraints to the given query. It's going to set all relationship
   * as `with` alongside with its closure constraints.
   */
  private static addHasWhereConstraints (query: Query, newQuery: Query): void {
    query.have.forEach((constraint) => {
      newQuery.with(constraint.relation, constraint.constraint)
    })
  }

  /**
   * Add has constraints as where clause.
   */
  private static addHasConstraints (query: Query, collection: Collection): void {
    const comparators = this.getComparators(query)

    const ids: string[] = []

    collection.forEach((model) => {
      if (comparators.every(comparator => comparator(model))) {
        ids.push(model.$id as string)
      }
    })

    query.whereIdIn(ids)
  }

  /**
   * Get comparators for the has clause.
   */
  private static getComparators (query: Query): Predicate[] {
    return query.have.map(constraint => this.getComparator(constraint))
  }

  /**
   * Get a comparator for the has clause.
   */
  private static getComparator (constraint: Has): Predicate {
    const compare = this.getCountComparator(constraint.operator)

    return (model: Model): boolean => {
      const count = this.getRelationshipCount(model[constraint.relation])

      const result = compare(count, constraint.count)

      return constraint.type === 'exists' ? result : !result
    }
  }

  /**
   * Get count of the relationship.
   */
  private static getRelationshipCount (relation: Collection | Item): number {
    if (Array.isArray(relation)) {
      return relation.length
    }

    return relation ? 1 : 0
  }

  /**
   * Get comparator function for the `has` clause.
   */
  private static getCountComparator (operator: string): (x: number, y: number) => boolean {
    switch (operator) {
      case '=':
        return (x: number, y: number): boolean => x === y

      case '>':
        return (x: number, y: number): boolean => x > y

      case '>=':
        return (x: number, y: number): boolean => x >= y

      case '<':
        return (x: number, y: number): boolean => x > 0 && x < y

      case '<=':
        return (x: number, y: number): boolean => x > 0 && x <= y

      default:
        return (x: number, y: number): boolean => x === y
    }
  }
}
