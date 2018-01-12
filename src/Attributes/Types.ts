import AttrTypes from './AttrTypes'

export type Type = Attr

export interface Attr {
  type: AttrTypes.Attr
  value: any
  mutator?: (value: any) => any
}
