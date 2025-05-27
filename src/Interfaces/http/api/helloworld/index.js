const HelloWorldHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'helloWorld',
  version: '1.0.0',
  register: server => {
    const helloWorldHandler = new HelloWorldHandler()
    server.route(routes(helloWorldHandler))
  }
}
