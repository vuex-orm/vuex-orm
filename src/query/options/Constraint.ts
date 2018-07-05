import Query from '../Query'

export type Constraint = (query: Query) => boolean | null | void

export default Constraint
