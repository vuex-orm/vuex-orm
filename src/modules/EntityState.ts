export interface EntityState {
  $connection: string
  $name: string
  data: { [id: string]: any }
  [key: string]: any
}

export default EntityState
