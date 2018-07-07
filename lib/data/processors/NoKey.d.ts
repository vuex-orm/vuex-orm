export default class NoKey {
    /**
     * Count to create a unique id for the record that missing its primary key.
     */
    static count: number;
    /**
     * Prefix string to be used for undefined primary key value.
     */
    static prefix: string;
    /**
     * Current no key value for the keys.
     */
    keys: {
        [key: string]: string;
    };
    /**
     * Get no key class.
     */
    self(): typeof NoKey;
    /**
     * Get current no key value for the given key.
     */
    get(key: string): string;
    /**
     * Increment the count, then set new key to the keys.
     */
    increment(key: string): string;
}
