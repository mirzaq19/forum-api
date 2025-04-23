import AuthenticationRepositoryPostgres from '../AuthenticationRepositoryPostgres.js'
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js'
import pool from '../../database/postgres/pool.js'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'

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
      const authentications =
        await AuthenticationsTableTestHelper.findToken(refreshToken)
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
      const authentications =
        await AuthenticationsTableTestHelper.findToken(refreshToken)
      expect(authentications).toHaveLength(0)
    })
  })
})
