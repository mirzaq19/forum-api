import Hapi from '@hapi/hapi'
import users from '../../Interfaces/http/api/users/index.js'
import authentications from '../../Interfaces/http/api/authentications/index.js'
import config from '../../Commons/config.js'
import setupMiddleware from './middleware.js'

const createServer = async container => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    }
  ])

  setupMiddleware(server)

  return server
}

export default createServer
