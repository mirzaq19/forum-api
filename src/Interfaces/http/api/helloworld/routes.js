const routes = handler => [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => handler.helloWorld(request, h)
  }
]

module.exports = routes
