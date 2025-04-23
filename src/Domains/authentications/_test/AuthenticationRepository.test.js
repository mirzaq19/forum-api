import AuthenticationRepository from '../AuthenticationRepository.js'

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository()

    // Action and Assert
    await expect(
      authenticationRepository.addRefreshToken('token')
    ).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      authenticationRepository.verifyRefreshToken('token')
    ).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(
      authenticationRepository.deleteRefreshToken('token')
    ).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
