import Model from '../../model/Model'

export type BeforeDeleteHook = (model: Model) => false | void

export default BeforeDeleteHook
