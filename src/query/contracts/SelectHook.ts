import Collection from '../../data/Collection'

export type SelectHook<T extends Collection = Collection> = (models: T, entity: string) => T

export default SelectHook
