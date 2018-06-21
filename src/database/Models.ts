import Model from '../model/Model'

export interface Models {
  [name: string]: typeof Model
}

export default Models
