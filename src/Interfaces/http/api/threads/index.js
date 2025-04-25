import ThreadHandler from './handler.js'
import routes from './routes.js'

export default {
  name: 'threads',
  register: (server, { container }) => {
    const threadHandler = new ThreadHandler(container)
    server.route(routes(threadHandler))
  }
}
