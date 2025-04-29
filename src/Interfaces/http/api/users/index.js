const UserHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'users',
  register: (server, { container }) => {
    const userHandler = new UserHandler(container)
    server.route(routes(userHandler))
  }
}
