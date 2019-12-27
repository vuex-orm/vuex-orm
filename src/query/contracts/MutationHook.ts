import Model from '../../model/Model'

export type MutationHook = (newModel: Model, oldModel: Model | null, entity: string) => void | false

export default MutationHook
