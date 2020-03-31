export default class Uid {
  /**
   * Count to create a unique id.
   */
  private static count: number = 0

  /**
   * Prefix string to be used for the id.
   */
  private static prefix: string = '$uid'

  /**
   * Generate an UUID.
   */
  static make(): string {
    this.count++

    return `${this.prefix}${this.count}`
  }

  /**
   * Reset the count to 0.
   */
  static reset(): void {
    this.count = 0
  }
}
