const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase.js')
const DeleteAuthenticationUseCase = require('../../../../Applications/use_case/DeleteAuthenticationUseCase.js')
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase.js')

class AuthenticationHandler {
  constructor(container) {
    this._container = container
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name)
    const { accessToken, refreshToken } = await loginUserUseCase.execute(
      request.payload
    )
    return h
      .response({
        status: 'success',
        data: {
          accessToken,
          refreshToken
        }
      })
      .code(201)
  }

  async putAuthenticationHandler(request, h) {
    const refreshAuthenticationUseCase = this._container.getInstance(
      RefreshAuthenticationUseCase.name
    )
    const accessToken = await refreshAuthenticationUseCase.execute(
      request.payload
    )
    return h
      .response({
        status: 'success',
        data: {
          accessToken
        }
      })
      .code(200)
  }

  async deleteAuthenticationHandler(request, h) {
    const deleteAuthenticationUseCase = this._container.getInstance(
      DeleteAuthenticationUseCase.name
    )
    await deleteAuthenticationUseCase.execute(request.payload)

    return h
      .response({
        status: 'success',
        message: 'Logout berhasil'
      })
      .code(200)
  }
}

module.exports = AuthenticationHandler
