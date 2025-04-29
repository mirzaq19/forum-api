const ThreadHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'threads',
  register: (server, { container }) => {
    const threadHandler = new ThreadHandler(container)
    server.route(routes(threadHandler))
  }
}
