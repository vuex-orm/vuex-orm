import HasConstraint from './HasConstraint'

export interface Has {
  relation: string
  type: string
  operator: string
  count: number
  constraint: HasConstraint | null
}

export default Has
