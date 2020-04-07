export interface Where {
  field: string | number
  value: any
  boolean: 'and' | 'or'
}

export interface WhereGroup {
  and?: Where[]
  or?: Where[]
}
