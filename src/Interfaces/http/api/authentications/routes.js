const routes = handler => [
  {
    path: '/authentications',
    method: 'POST',
    handler: (request, h) => handler.postAuthenticationHandler(request, h)
  },
  {
    path: '/authentications',
    method: 'PUT',
    handler: (request, h) => handler.putAuthenticationHandler(request, h)
  },
  {
    path: '/authentications',
    method: 'DELETE',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h)
  }
]

module.exports = routes
