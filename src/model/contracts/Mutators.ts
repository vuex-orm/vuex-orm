import Mutator from './Mutator'

export interface Mutators {
  [name: string]: Mutator<any>
}

export default Mutators
