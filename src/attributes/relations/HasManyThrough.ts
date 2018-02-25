import { Record, NormalizedData, PlainCollection } from '../../data/Contract'
import Model from '../../model/Model'
import Repo, { Relation as Load } from '../../repo/Repo'
import Relation from './Relation'

export type Entity = typeof Model | string

export default class HasManyThrough extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The "through" parent model.
   */
  through: typeof Model

  /**
   * The near key on the relationship.
   */
  firstKey: string

  /**
   * The far key on the relationship.
   */
  secondKey: string

  /**
   * The local key on the relationship.
   */
  localKey: string

  /**
   * The local key on the intermediary model.
   */
  secondLocalKey: string

  /**
   * The related records.
   */
  records: PlainCollection = []

  /**
   * Create a new has many through instance.
   */
  constructor (
    model: typeof Model,
    related: Entity,
    through: Entity,
    firstKey: string,
    secondKey: string,
    localKey: string,
    secondLocalKey: string
  ) {
    super(model)

    this.related = this.model.relation(related)
    this.through = this.model.relation(through)
    this.firstKey = firstKey
    this.secondKey = secondKey
    this.localKey = localKey
    this.secondLocalKey = secondLocalKey
  }

  /**
   * Return empty array if the value is not present.
   */
  fill (value: any): any {
    return value || []
  }

  /**
   * Attach the relational key to the given record.
   */
  attach (_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Load the has many through relationship for the record.
   */
  load (repo: Repo, record: Record, relation: Load): PlainCollection {
    const throuthQuery = new Repo(repo.state, this.through.entity, false)

    const throughIds = throuthQuery.where(this.firstKey, record[this.localKey]).get().map(through => through[this.secondLocalKey])

    const relatedQuery = new Repo(repo.state, this.related.entity, false)

    relatedQuery.where(this.secondKey, (id: any) => throughIds.includes(id))

    this.addConstraint(relatedQuery, relation)

    return relatedQuery.get()
  }

  /**
   * Make model instances of the relation.
   */
  make (value: any, _parent: Record, _key: string): Model[] {
    if (value.length === 0) {
      return []
    }

    return value.map((record: Record) => new this.related(record))
  }
}
