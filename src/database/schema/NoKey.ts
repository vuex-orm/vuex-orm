export default class NoKey {
  /**
   * Count to create a unique id for the record that missing its primary key.
   */
  static count: number = 0

  /**
   * Prefix string to be used for undefined primary key value.
   */
  static prefix: string = '_no_key_'

  /**
   * Current no key value for the keys.
   */
  keys: { [key: string]: string } = {}

  /**
   * Get no key class.
   */
  self (): typeof NoKey {
    return this.constructor as typeof NoKey
  }

  /**
   * Get current no key value for the given key.
   */
  get (key: string): string {
    return this.keys[key]
  }

  /**
   * Increment the count, then set new key to the keys.
   */
  increment (key: string): string {
    this.self().count++

    this.keys[key] = `${this.self().prefix}${this.self().count}`

    return this.keys[key]
  }
}
