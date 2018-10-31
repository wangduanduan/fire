/* global expect, test, beforeAll, afterAll*/
const xfire = require('../dist/xfire.cjs.js')
const app = require('./serve.js')
const serverPort = 3000
var serverInstance = null
var apiConfig = require('./api.config.js')
var axios = require('axios')
var myApi = xfire(apiConfig, axios)

var sessionId = ''

beforeAll(() => {
  serverInstance = app.listen(serverPort)
})

afterAll(() => {
  serverInstance.close()
})

test('check config', () => {
  expect(() => {
    xfire({}, axios)
  }).toThrow()

  expect(() => {
    xfire({baseURL: 'http://localhost:8080', apis: []}, axios)
  }).toThrow()

  expect(() => {
    xfire({baseURL: 'http://localhost:8080', apis: [{name: 'dd', url: '/pp'}]}, axios)
  }).not.toThrow()
})

test('login with bad password test', () => {
  expect.assertions(1)

  return myApi.login.fire({}, {
    email: 'wdd@cc.tt',
    password: '000111'
  })
  .catch((err) => {
    expect(err.response.status).toBe(401)
  })
})

test('login success test', () => {
  expect.assertions(1)

  return myApi.login.fire({}, {
    email: 'wdd@cc.tt',
    password: '000'
  })
  .then((res) => {
    sessionId = res.data.sessionId
    expect(res.data.sessionId).toBe('123456')
  })
})

test('query string render success test without sessionId', () => {
  expect.assertions(1)

  return myApi.getOneUser.fire({id: '1'})
  .catch((err) => {
    expect(err.response.status).toBe(403)
  })
})

test('query string render success test', () => {
  expect.assertions(1)
  myApi.$setCommonHeader('sessionId', sessionId)

  return myApi.getOneUser.fire({id: '1'})
  .then((res) => {
    expect(res.data.userName).toBe('wdd')
  })
})

test('query string render with bad id test', () => {
  expect.assertions(1)

  return myApi.getOneUser.fire({id: '2'})
  .catch((err) => {
    expect(err.response.status).toBe(404)
  })
})
