export default class Uuid {
  /**
   * Count to create a unique id.
   */
  private static count: number = 0

  /**
   * Prefix string to be used for the id.
   */
  private static prefix: string = '$uuid'

  /**
   * Generate an UUID.
   */
  static make (): string {
    this.count++

    return `${this.prefix}${this.count}`
  }
}