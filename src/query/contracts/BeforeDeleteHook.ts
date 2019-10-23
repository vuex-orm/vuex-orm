import Model from '../../model/Model'

export type BeforeDeleteHook = (model: Model, entity: string) => false | void

export default BeforeDeleteHook
