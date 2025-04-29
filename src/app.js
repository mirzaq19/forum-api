const createServer = require('./Infrastructures/http/createServer.js')
const container = require('./Infrastructures/container.js')

const start = async () => {
  const server = await createServer(container)
  await server.start()
  console.log(`server start at ${server.info.uri}`)
}

start()
