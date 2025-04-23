import UserHandler from './handler.js'
import routes from './routes.js'

export default {
  name: 'users',
  register: (server, { container }) => {
    const userHandler = new UserHandler(container)
    server.route(routes(userHandler))
  }
}
