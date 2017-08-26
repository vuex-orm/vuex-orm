import test from 'ava'
import * as sinon from 'sinon'
import Repo from '../../Repo'
import mutations from '../mutations'

test('mutation can call create method on Repo', (t) => {
  const MockRepo = sinon.stub(Repo, 'create')

  const state = { name: '' }

  mutations.create(state, { data: {} })

  t.true(MockRepo.calledWith(state, {}))
})
