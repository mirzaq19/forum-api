export default class RefreshAuthenticationUseCase {
  constructor({ authenticationRepository, tokenManager }) {
    this._authenticationRepository = authenticationRepository
    this._tokenManager = tokenManager
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload)
    const { refreshToken } = useCasePayload

    const { sub: userId } = this._tokenManager.verifyRefreshToken(refreshToken)
    await this._authenticationRepository.verifyRefreshToken(refreshToken)
    return this._tokenManager.generateAccessToken({ sub: userId })
  }

  _validatePayload(payload) {
    const { refreshToken } = payload
    if (!refreshToken) {
      throw new Error(
        'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
      )
    }

    if (typeof refreshToken !== 'string') {
      throw new Error(
        'REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      )
    }
  }
}
