import { isArray } from '../support/Utils'
import Record from '../data/Record'
import Item from '../data/Item'
import Collection from '../data/Collection'
import Relation from '../attributes/relations/Relation'
import Model from './Model'

export interface Option {
  relations?: boolean
}

const defaultOption: Option = {
  relations: true
}

/**
 * Serialize the given model to attributes. This method will ignore
 * relationships, and it includes the index id. If the record is a derived
 * STI enitity, include type key as well.
 */
export function toAttributes (record: Model): Record {
  const model = Model.getModelFromRecord(record) as typeof Model
  const serializedRecord = toJson(record, { relations: false })

  serializedRecord.$id = record.$id

  if (model.baseEntity && !record[model.typeKey]) {
    const baseModel = model.database().baseModel(model) as typeof Model
    serializedRecord[baseModel.typeKey] = baseModel.getTypeKeyValueFromModel(model)
  }

  return serializedRecord
}

/**
 * Serialize given model POJO.
 */
export function toJson(model: Model, option: Option = {}): Record {
  option = { ...defaultOption, ...option }

  const record: Record = {}

  const fields = model.$fields()

  for (const key in fields) {
    const f = fields[key]
    const v = model[key]

    if (f instanceof Relation) {
      record[key] = option.relations ? relation(v) : emptyRelation(v)
      continue
    }

    record[key] = value(model[key])
  }

  return record
}

/**
 * Serialize given value.
 */
function value(v: any): any {
  if (v === null) {
    return null
  }

  if (isArray(v)) {
    return array(v)
  }

  if (typeof v === 'object') {
    return object(v)
  }

  return v
}

/**
 * Serialize an array into json.
 */
function array(a: any[]): any[] {
  return a.map((v) => value(v))
}

/**
 * Serialize an object into json.
 */
function object(o: object): object {
  const obj = {}

  for (const key in o) {
    obj[key] = value(o[key])
  }

  return obj
}

/**
 * Serialize given relation into json.
 */
function relation(relation: Item): Record | null
function relation(relation: Collection): Record[]
function relation(relation: Item | Collection): Record | Record[] | null {
  if (relation === null) {
    return null
  }

  if (isArray(relation)) {
    return relation.map((model) => model.$toJson())
  }

  return relation.$toJson()
}

/**
 * Serialize given relation into empty json.
 */
function emptyRelation(relation: Item): null
function emptyRelation(relation: Collection): []
function emptyRelation(relation: Item | Collection): [] | null {
  return isArray(relation) ? [] : null
}
