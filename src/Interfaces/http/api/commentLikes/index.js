const CommentLikeHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'commentLikes',
  version: '1.0.0',
  register: (server, { container }) => {
    const commentLikeHandler = new CommentLikeHandler({ container })
    server.route(routes(commentLikeHandler))
  }
}
