import AuthenticationHandler from './handler.js'
import routes from './routes.js'

export default {
  name: 'authentications',
  register: (server, { container }) => {
    const authenticationHandler = new AuthenticationHandler(container)
    server.route(routes(authenticationHandler))
  }
}
