import CommentHandler from './handler.js'
import routes from './routes.js'

export default {
  name: 'comments',
  version: '1.0.0',
  register: (server, { container }) => {
    const commentHandler = new CommentHandler({ container })
    server.route(routes(commentHandler))
  }
}
