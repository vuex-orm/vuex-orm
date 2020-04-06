import State from './State'

export default interface RootState {
  [entity: string]: State
}
