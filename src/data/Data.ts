import Model from '../Model'

/**
 * Plane data interface. It takes form of;
 *
 * {
 *   id: 1,
 *   name: 'John Doe',
 *
 *   profiles: [
 *     { id: 1, user_id: 1, age: 24 },
 *     { id: 2, user_id: 2, age: 32 }
 *   ]
 * }
 */
export interface Data {
  [field: string]: any
}

/**
 * Normalized data interface. It tales form of;
 *
 * {
 *   users: {
 *     1: { id: 1, name: 'John doe', profile: 1 },
 *     2: { id: 2, name: 'Jane doe', profile: 2 }
 *   },
 *   profiles: {
 *     1: { id: 1, user_id: 1, age: 24 },
 *     2: { id: 2, user_id: 2, age: 32 }
 *   }
 * }
 */
export interface NormalizedData {
  [entity: string]: {
    [id: number]: Data
  }
}

/**
 * Data interface which have been wrapped by model. It takes form of;
 *
 * {
 *   1: User
 * }
 */
export interface WrappedData {
  [id: number]: Model
}

/**
 * Normilized and wrapped data interface. It takes form of;
 *
 * {
 *   users: {
 *     1: User,
 *     2: User
 *   },
 *   profiles: {
 *     1: Profile,
 *     2: Profile
 *   }
 * }
 */
export interface WrappedNormalizedData {
  [entity: string]: WrappedData
}
