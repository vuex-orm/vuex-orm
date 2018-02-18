import Type from './Type'

export type Mutator = (value: any) => any

export default class Attr extends Type {
  /**
   * The value of the field.
   */
  value: any

  /**
   * Mutator for the field.
   */
  mutator?: Mutator

  /**
   * Create a new attr instance.
   */
  constructor (value: any, mutator?: Mutator) {
    super()

    this.value = value
    this.mutator = mutator
  }

  /**
   * Return the default value if the given value is empty.
   */
  fill (value: any): any {
    return value !== undefined ? value : this.value
  }
}
