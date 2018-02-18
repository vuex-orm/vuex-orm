export default abstract class Attribute {
  /**
   * Return the appropriate value for the normalization. This method will
   * be called during the data normalization to fill field value.
   */
  abstract fill (value: any, parent: any): any
}
