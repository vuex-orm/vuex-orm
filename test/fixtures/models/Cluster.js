import Model, { Fields } from 'app/model/Model'
import Node from './Node'

export default class Cluster extends Model {
  static entity = 'clusters'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      nodeIds: this.attr([]),
      nodes: this.hasManyBy(Node, 'nodes', 'id')
    }
  }
}
