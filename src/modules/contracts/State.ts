import Record from '../../data/Record'

export interface State {
  $connection: string
  $name: string
  data: Record
  [key: string]: any
}

export default State
