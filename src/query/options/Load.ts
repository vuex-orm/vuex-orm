import Constraint from './Constraint'

export interface Load {
  [relation: string]: Constraint[]
}

export default Load
