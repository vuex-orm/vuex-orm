export interface State {
  data: any,
  [key: string]: any
}

/**
 * Returns the initial state of the entity.
 */
export default {
  data: {}
} as State
