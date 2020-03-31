import Record from '../../data/Record'
import Model from '../../model/Model'
import Query from '../Query'

export type WherePrimaryClosure = (
  record: Record,
  query: Query,
  model?: Model
) => boolean | void

export default WherePrimaryClosure
