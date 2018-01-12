export default {
  prefix: 'https://api.wellcloud.cc',
  list: [
    {
      name: 'login',
      desp: 'sercurity login',
      path: '/agent/login',
      method: 'post',
      contentType: 'formData',
      bodyStruct: {
        username: 'string',
        password: 'string',
        namespace: 'string'
      },
      defaultBody: {
        password: 'Aa123456'
      },
      status: {
        401: 'username or password wrong'
      }
    },
    {
      name: 'heartBeat',
      desp: 'agent heart beat',
      path: '/sdk/api/csta/agent/heartbeat/{{agentId}}',
      method: 'post'
    },
    {
      name: 'setAgentState',
      desp: 'set agent state',
      path: '/sdk/api/csta/agent/state',
      method: 'post',
      bodyStruct: {
        agentId: 'string?',
        loginId: 'string',
        func: 'string',
        agentMode: 'string?',
        device: 'string?',
        password: 'string'
      }
    }
  ]
}
