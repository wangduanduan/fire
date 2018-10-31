module.exports = {
  baseURL: 'http://localhost:3000',
  apis: [
    {
      name: 'login',
      url: '/login',
      method: 'post'
    },
    {
      name: 'getOneUser',
      url: '/users/{{id}}',
      method: 'get'
    }
  ]
}
