import test from 'ava'
import * as sinon from 'sinon'
import { actionContext } from '../../__test__/support/Helpers'
import actions from '../actions'

test('action can create given data in to the store', (t) => {
  const commit = sinon.stub()
  const context = actionContext({ commit })

  const data = {}

  actions.create(context, { data })

  t.true(commit.calledWith('create', { data }))
})
