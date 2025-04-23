import JWT from '@hapi/jwt'
import JWTTokenManager from '../JWTTokenManager.js'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'

describe('JWTTokenManager', () => {
  describe('generateAccessToken function', () => {
    it('should generate access token correctly', () => {
      // Arrange
      const jwtTokenManager = new JWTTokenManager(JWT)
      const payload = { sub: 'user-123' }

      // Action
      const accessToken = jwtTokenManager.generateAccessToken(payload)

      // Assert
      expect(typeof accessToken).toEqual('string')
    })
  })
  describe('generateRefreshToken function', () => {
    it('should generate refresh token correctly', () => {
      // Arrange
      const jwtTokenManager = new JWTTokenManager(JWT)
      const payload = { sub: 'user-123' }

      // Action
      const refreshToken = jwtTokenManager.generateRefreshToken(payload)

      // Assert
      expect(typeof refreshToken).toEqual('string')
    })
  })
  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when refresh token is invalid', () => {
      // Arrange
      const jwtTokenManager = new JWTTokenManager(JWT)
      const invalidRefreshToken = 'invalid-refresh-token'

      // Action & Assert
      expect(() =>
        jwtTokenManager.verifyRefreshToken(invalidRefreshToken)
      ).toThrow(InvariantError)
    })
    it('should verify refresh token correctly', () => {
      // Arrange
      const jwtTokenManager = new JWTTokenManager(JWT)
      const payload = { sub: 'user-123' }
      const refreshToken = jwtTokenManager.generateRefreshToken(payload)

      // Action
      const verifiedPayload = jwtTokenManager.verifyRefreshToken(refreshToken)

      // Assert
      expect(verifiedPayload).toHaveProperty('sub', payload.sub)
    })
  })
})
