import Collection from '../../data/Collection'

export type RetrieveHook<T extends Collection = Collection> = (models: T, entity: string) => T

export default RetrieveHook
