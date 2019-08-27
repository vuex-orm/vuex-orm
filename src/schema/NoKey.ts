/* istanbul ignore next */
export default class NoKey {
  /**
   * Count to create a unique id for the record that missing its primary key.
   */
  private static count: number = 0

  /**
   * Prefix string to be used for undefined primary key value.
   */
  private static prefix: string = '_no_key_'

  /**
   * The current unique id value. This is the combination of
   * the `prefix` and the `count`.
   */
  private static value: string = ''

  /**
   * Set new unique id value.
   */
  static set (): void {
    this.value = `${this.prefix}${this.count}`
  }

  /**
   * Get the current unique id value.
   */
  static get (): string {
    return this.value
  }

  /**
   * Increment the count, then set the new unique id value.
   */
  static increment (): string {
    this.count++

    this.set()

    return this.get()
  }
}
