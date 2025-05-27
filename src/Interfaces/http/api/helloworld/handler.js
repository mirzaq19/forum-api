class HelloWorldHandler {
  helloWorld(request, h) {
    return h
      .response({
        status: 'success',
        message: 'Hello, World!'
      })
      .code(200)
  }
}

module.exports = HelloWorldHandler
