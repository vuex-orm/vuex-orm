import Query from '../Query'

export type Constraint = (query: Query) => boolean

export default Constraint
