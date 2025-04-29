const AuthenticationHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'authentications',
  register: (server, { container }) => {
    const authenticationHandler = new AuthenticationHandler(container)
    server.route(routes(authenticationHandler))
  }
}
