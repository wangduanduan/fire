/* global test,expect */
import * as util from '../src/util/index.js'

test('templateQuery', () => {
  expect(util.templateQuery('/api/{{type}}/{{age}}', {type: 'dog', age: 12})).toBe('/api/dog/12')
  expect(util.templateQuery('/api/{{type}}/{{age}}', {age: 12})).toBe('/api/undefined/12')
  expect(util.templateQuery('/api/{{type}}/{{age}}', {})).toBe('/api/undefined/undefined')
})

test('stringify', () => {
  expect(util.stringify({type: 'dog', age: 12})).toBe('type=dog&age=12')
  expect(util.stringify({age: 12})).toBe('age=12')
  expect(util.stringify({})).toBe('')
})

test('checkConfig', () => {
  expect(util.checkConfig({
    prefix: 'https://api.wellcloud.cc',
    list: [{
      name: 'heartBeat',
      desp: 'agent heart beat',
      path: '/sdk/api/csta/agent/heartbeat/{{agentId}}',
      method: 'post'
    }]
  })).toBeUndefined()
})
