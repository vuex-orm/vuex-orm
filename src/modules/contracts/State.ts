import Records from '../../data/Records'

export interface State {
  $connection: string
  $name: string
  data: Records
  [key: string]: any
}

export default State
