class TokenManager {
  generateAccessToken(payload) {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }
  generateRefreshToken(payload) {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }
  verifyRefreshToken(token) {
    throw new Error('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = TokenManager
