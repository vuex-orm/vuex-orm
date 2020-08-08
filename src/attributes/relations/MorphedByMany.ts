import { Schema as NormalizrSchema } from 'normalizr'
import Utils from '../../support/Utils'
import Schema from '../../schema/Schema'
import { Record, Records, NormalizedData, Collection } from '../../data'
import Model from '../../model/Model'
import Query from '../../query/Query'
import Constraint from '../../query/contracts/RelationshipConstraint'
import Relation from './Relation'
import { PivotModel } from '../../model/proxies/ModelProxies'

export type Entity = typeof Model | string

export default class MorphedByMany extends Relation {
  /**
   * The related model.
   */
  related: typeof Model

  /**
   * The pivot model.
   */
  pivot: typeof Model

  /**
   * The field name that contains id of the related model.
   */
  relatedId: string

  /**
   * The field name that contains id of the parent model.
   */
  id: string

  /**
   * The field name that contains type of the parent model.
   */
  type: string

  /**
   * The key name of the parent model.
   */
  parentKey: string

  /**
   * The key name of the related model.
   */
  relatedKey: string

  /**
   * The key name of the pivot data.
   */
  pivotKey: string = 'pivot'

  /**
   * Create a new belongs to instance.
   */
  constructor(
    model: typeof Model,
    related: Entity,
    pivot: Entity,
    relatedId: string,
    id: string,
    type: string,
    parentKey: string,
    relatedKey: string
  ) {
    super(model) /* istanbul ignore next */

    this.related = this.model.relation(related)
    this.pivot = this.model.relation(pivot)
    this.relatedId = relatedId
    this.id = id
    this.type = type
    this.parentKey = parentKey
    this.relatedKey = relatedKey
  }

  /**
   * Specify the custom pivot accessor to use for the relationship.
   */
  as(accessor: string): this {
    this.pivotKey = accessor

    return this
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the relational key to the given data. Since morphed by many
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach(_key: any, _record: Record, _data: NormalizedData): void {
    return
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  make(value: any, _parent: Record, _key: string): Model[] {
    return this.makeManyRelation(value, this.related)
  }

  /**
   * Load the morph many relationship for the record.
   */
  load(
    query: Query,
    collection: Collection,
    name: string,
    constraints: Constraint[]
  ): void {
    const relatedQuery = this.getRelation(
      query,
      this.related.entity,
      constraints
    )

    const pivotQuery = query.newQuery(this.pivot.entity)

    this.addEagerConstraintForPivot(pivotQuery, collection, this.related.entity)

    const pivots = pivotQuery.get()

    this.addEagerConstraintForRelated(relatedQuery, pivots)

    const relateds = this.mapPivotRelations(pivots, relatedQuery)

    collection.forEach((item) => {
      const related = relateds[item[this.parentKey]]

      item[name] = related || []
    })
  }

  /**
   * Set the constraints for the pivot relation.
   */
  addEagerConstraintForPivot(
    query: Query,
    collection: Collection,
    type: string
  ): void {
    query
      .whereFk(this.type, type)
      .whereFk(this.relatedId, this.getKeys(collection, this.parentKey))
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraintForRelated(query: Query, collection: Collection): void {
    query.whereFk(this.relatedKey, this.getKeys(collection, this.id))
  }

  /**
   * Create a new indexed map for the pivot relation.
   */
  mapPivotRelations(pivots: Collection, relatedQuery: Query): Records {
    const relations = this.mapManyRelations(relatedQuery.get(), this.relatedKey)

    if (relatedQuery.orders.length) {
      return this.mapRelationsByOrders(
        pivots,
        relations,
        this.relatedId,
        this.id
      )
    }

    return pivots.reduce<Record>((records, record) => {
      const id = record[this.relatedId]

      if (!records[id]) {
        records[id] = []
      }

      const related = relations.get(record[this.id])

      /* istanbul ignore if */
      if (related === undefined || related.length === 0) {
        return records
      }

      records[id] = records[id].concat(
        related.map((model: Record) => {
          const pivotKeyArray = [
            model.id,
            id,
            record[this.type]
          ]

          const pivotKey = !this.pivot.isCompositePrimaryKey()
            ? JSON.stringify(pivotKeyArray)
            : pivotKeyArray

          return new PivotModel(model, pivotKey, this.pivot, this.pivotKey);
        })
      )

      return records
    }, {})
  }

  /**
   * Create pivot records for the given records if needed.
   */
  createPivots(
    parent: typeof Model,
    data: NormalizedData,
    key: string
  ): NormalizedData {
    Utils.forOwn(data[parent.entity], (record) => {
      const related = record[key]

      if (!Utils.isArray(related)) {
        return
      }

      this.createPivotRecord(data, record, related)
    })

    return data
  }

  /**
   * Create a pivot record.
   */
  createPivotRecord(
    data: NormalizedData,
    record: Record,
    related: any[]
  ): void {
    related.forEach((id) => {
      const parentId = record[this.parentKey]
      const pivotKey = `${id}_${parentId}_${this.related.entity}`
      const pivotData = data[this.related.entity][id][this.pivotKey] || {}

      data[this.pivot.entity] = {
        ...data[this.pivot.entity],

        [pivotKey]: {
          ...pivotData,
          $id: pivotKey,
          [this.relatedId]: parentId,
          [this.id]: this.model.getIdFromRecord(data[this.related.entity][id]),
          [this.type]: this.related.entity
        }
      }
    })
  }
}
