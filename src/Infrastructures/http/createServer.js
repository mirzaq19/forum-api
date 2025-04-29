const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const users = require('../../Interfaces/http/api/users/index.js')
const authentications = require('../../Interfaces/http/api/authentications/index.js')
const threads = require('../../Interfaces/http/api/threads/index.js')
const comments = require('../../Interfaces/http/api/comments/index.js')
const config = require('../../Commons/config.js')
const setupMiddleware = require('./middleware.js')

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

module.exports = createServer
