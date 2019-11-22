import Query from '../Query'

export type Constraint = (query: Query) => boolean | void

export default Constraint
