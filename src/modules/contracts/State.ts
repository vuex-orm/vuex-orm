import Instances from '../../data/Instances'

export interface State {
  $connection: string
  $name: string
  data: Instances
  [key: string]: any
}

export default State
