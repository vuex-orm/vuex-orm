import Model from '../../model/Model'

export type AfterUpdateHook = (model: Model, entity: string) => void

export default AfterUpdateHook
