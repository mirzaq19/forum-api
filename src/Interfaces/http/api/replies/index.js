const ReplyHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'replies',
  version: '1.0.0',
  register: async (server, { container }) => {
    const handler = new ReplyHandler({ container })
    server.route(routes(handler))
  }
}
