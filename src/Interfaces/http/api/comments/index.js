const CommentHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'comments',
  version: '1.0.0',
  register: (server, { container }) => {
    const commentHandler = new CommentHandler({ container })
    server.route(routes(commentHandler))
  }
}
