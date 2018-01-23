import AttrTypes from './AttrTypes'

export type Type = Attr | Increment

export interface Attr {
  type: AttrTypes.Attr
  value: any
  mutator?: (value: any) => any
}

export interface Increment {
  type: AttrTypes.Increment
  value: number
}
