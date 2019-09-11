import Model from '../../model/Model'

export type BeforeCreateHook = (model: Model, entity: string) => false | void

export default BeforeCreateHook
