import PersistOptions from '../payloads/PersistOptions'

export default class OptionsBuilder {
  /**
   * Get persist options from the given payload.
   */
  static createPersistOptions (payload: PersistOptions): PersistOptions {
    return {
      create: payload.create,
      insert: payload.insert,
      update: payload.update,
      insertOrUpdate: payload.insertOrUpdate
    }
  }
}
