import WhereBoolean from './WhereBoolean'
import WherePrimaryClosure from './WherePrimaryClosure'
import WhereSecondaryClosure from './WhereSecondaryClosure'

export interface Where {
  field: string | number | WherePrimaryClosure
  value: string | number | WhereSecondaryClosure
  boolean: WhereBoolean
}

export default Where
