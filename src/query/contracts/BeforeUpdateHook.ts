import Model from '../../model/Model'

export type BeforeUpdateHook = (model: Model, entity: string) => false | void

export default BeforeUpdateHook
