export default class Attr {
  /**
   * The default value of the field.
   */
  value: any

  /**
   * Mutator for the field.
   */
  mutator?: (value: any) => any

  /**
   * Create a new attr instance.
   */
  constructor (value: any, mutator?: (value: any) => any) {
    this.value = value
    this.mutator = mutator
  }
}
