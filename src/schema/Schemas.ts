import { schema as NormalizrSchema } from 'normalizr'

export interface Schemas {
  [name: string]: NormalizrSchema.Entity
}

export default Schemas
