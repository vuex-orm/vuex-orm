import Model from '../../model/Model'

export type AfterDeleteHook = (model: Model, entity: string) => void

export default AfterDeleteHook
