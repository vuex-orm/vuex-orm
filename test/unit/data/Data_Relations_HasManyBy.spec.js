import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'
import Repo from 'app/repo/Repo'
import Data from 'app/data/Data'

describe('Data – Relations – Has Many By', () => {
  it('can normalize the has many by relation', () => {
    class Node extends Model {
      static entity = 'nodes'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Cluster extends Model {
      static entity = 'clusters'

      static fields () {
        return {
          id: this.attr(null),
          nodes: this.hasManyBy(Node, 'nodes')
        }
      }
    }

    const store = createStore([{ model: Node }, { model: Cluster }])

    const repo = new Repo(store.state.entities, 'clusters')

    const data = {
      id: 1,
      nodes: [{ id: 1 }, { id: 2 }]
    }

    const expected = {
      nodes: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 }
      },
      clusters: {
        '1': { $id: 1, id: 1, nodes: [1, 2] }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize list of has many by relation', () => {
    class Node extends Model {
      static entity = 'nodes'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Cluster extends Model {
      static entity = 'clusters'

      static fields () {
        return {
          id: this.attr(null),
          nodes: this.hasManyBy(Node, 'nodes')
        }
      }
    }

    const store = createStore([{ model: Node }, { model: Cluster }])

    const repo = new Repo(store.state.entities, 'clusters')

    const data = [
      {
        id: 1,
        nodes: [{ id: 1 }, { id: 2 }]
      },
      {
        id: 2,
        nodes: [{ id: 3 }, { id: 4 }]
      }
    ]

    const expected = {
      nodes: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 },
        '4': { $id: 4, id: 4 }
      },
      clusters: {
        '1': { $id: 1, id: 1, nodes: [1, 2] },
        '2': { $id: 2, id: 2, nodes: [3, 4] }
      }
    }

    expect(Data.normalize(data, repo)).toEqual(expected)
  })

  it('can normalize the has many by relation', () => {
    class Node extends Model {
      static entity = 'nodes'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    class Cluster extends Model {
      static entity = 'clusters'

      static fields () {
        return {
          id: this.attr(null),
          node_ids: this.attr([]),
          nodes: this.hasManyBy(Node, 'node_ids')
        }
      }
    }

    const store = createStore([{ model: Node }, { model: Cluster }])

    const repo = new Repo(store.state.entities, 'clusters')

    const data = {
      id: 1,
      nodes: [{ id: 1 }, { id: 2 }]
    }

    const expected = {
      nodes: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 }
      },
      clusters: {
        '1': { $id: 1, id: 1, node_ids: [1, 2], nodes: [1, 2] }
      }
    }

    const normalizedData = Data.normalize(data, repo)

    expect(Data.fillAll(normalizedData, repo)).toEqual(expected)
  })
})
