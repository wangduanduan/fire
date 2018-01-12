import fire from '../dist/bundle.js'
import config from './api.config.js'

console.log('---------')

const API = fire.init(config)

console.log(API)

API.login.fire({}, {
  username: '5001',
  password: 'Aa123456',
  namespace: 'zhen04.cc'
})
  .then((res) => {
    API.$setHeaders({
      sessionId: res.sessionId
    })

    return API.heartBeat.fire({
      agentId: '5001@zhen04.cc'
    })
  })
  .then(() => {
    return API.setAgentState.fire({}, {
      'loginId': '5001@zhen04.cc',
      'device': '8001@zhen04.cc',
      'password': 'Aa123456',
      'agentMode': 'NotReady',
      'func': 'Login'
    })
  })
  .catch((err) => {
    console.error(err)
  })
