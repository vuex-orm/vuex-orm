import Model from '../../model/Model'

export type AfterCreateHook = (model: Model, entity: string) => void

export default AfterCreateHook
