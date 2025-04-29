const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres.js')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper.js')
const pool = require('../../database/postgres/pool.js')
const InvariantError = require('../../../Commons/exceptions/InvariantError.js')

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addRefreshToken function', () => {
    it('should persist refresh token', async () => {
      // Arrange
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool)
      const refreshToken = 'refresh_token'

      // Action
      await authenticationRepositoryPostgres.addRefreshToken(refreshToken)

      // Assert
      const authentications = await AuthenticationsTableTestHelper.findToken(
        refreshToken
      )
      expect(authentications).toHaveLength(1)
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when refresh token not valid', async () => {
      // Arrange
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool)
      const refreshToken = 'refresh_token'

      // Action & Assert
      await expect(
        authenticationRepositoryPostgres.verifyRefreshToken(refreshToken)
      ).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when refresh token valid', async () => {
      // Arrange
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool)
      const refreshToken = 'refresh_token'
      await AuthenticationsTableTestHelper.addToken(refreshToken)

      // Action & Assert
      await expect(
        authenticationRepositoryPostgres.verifyRefreshToken(refreshToken)
      ).resolves.not.toThrow(InvariantError)
    })
  })

  describe('deleteRefreshToken function', () => {
    it('should delete refresh token from database', async () => {
      // Arrange
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool)
      const refreshToken = 'refresh_token'
      await AuthenticationsTableTestHelper.addToken(refreshToken)

      // Action
      await authenticationRepositoryPostgres.deleteRefreshToken(refreshToken)

      // Assert
      const authentications = await AuthenticationsTableTestHelper.findToken(
        refreshToken
      )
      expect(authentications).toHaveLength(0)
    })
  })
})
