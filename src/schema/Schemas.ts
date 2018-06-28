import { schema as NormalizrSchema } from 'normalizr'

export interface Schemas {
  [entity: string]: NormalizrSchema.Entity
}

export default Schemas
