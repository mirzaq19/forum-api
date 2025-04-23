import TokenManager from '../../Applications/security/TokenManager.js'
import config from '../../Commons/config.js'
import InvariantError from '../../Commons/exceptions/InvariantError.js'

export default class JWTTokenManager extends TokenManager {
  constructor(jwt) {
    super()
    this._jwt = jwt
  }

  generateAccessToken(payload) {
    return this._jwt.token.generate(payload, config.jwt.accessTokenKey)
  }

  generateRefreshToken(payload) {
    return this._jwt.token.generate(payload, config.jwt.refreshTokenKey)
  }

  verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.token.decode(token)
      this._jwt.token.verify(artifacts, config.jwt.refreshTokenKey)
      return artifacts.decoded.payload
    } catch {
      throw new InvariantError('refresh token tidak valid')
    }
  }
}
