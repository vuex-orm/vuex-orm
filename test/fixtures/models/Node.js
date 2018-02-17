import Model, { Fields } from 'app/model/Model'
import Cluster from './Cluster'

export default class Node extends Model {
  static entity = 'nodes'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      clusterId: this.attr(null),
      cluster: this.belongsTo(Cluster, 'clusterId')
    }
  }
}
