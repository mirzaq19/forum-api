import Hapi from '@hapi/hapi'
import Jwt from '@hapi/jwt'
import users from '../../Interfaces/http/api/users/index.js'
import authentications from '../../Interfaces/http/api/authentications/index.js'
import threads from '../../Interfaces/http/api/threads/index.js'
import comments from '../../Interfaces/http/api/comments/index.js'
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
      plugin: Jwt
    }
  ])

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.accessTokenAge
    },
    validate: artifacts => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.sub
      }
    })
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    },
    {
      plugin: threads,
      options: { container }
    },
    {
      plugin: comments,
      options: { container }
    }
  ])

  setupMiddleware(server)

  return server
}

export default createServer
