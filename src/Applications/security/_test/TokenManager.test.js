import TokenManager from '../TokenManager.js'

describe('TokenManager interface', () => {
  it('should throw error when invoke abstract behavior', () => {
    // Arrange
    const tokenManager = new TokenManager()

    // Action & Assert
    expect(() => tokenManager.generateAccessToken({ sub: 1 })).toThrow(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    )
    expect(() => tokenManager.generateRefreshToken({ sub: 1 })).toThrow(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    )
    expect(() => tokenManager.verifyRefreshToken('token')).toThrow(
      'TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    )
  })
})
