import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'
import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase.js'

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error when payload did not contain refreshToken', async () => {
    // Arrange
    const useCasePayload = {}
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})
    // Action and Assert
    await expect(
      deleteAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    )
  })
  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123
    }
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})
    // Action and Assert
    await expect(
      deleteAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should orchestrating the logout user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token'
    }

    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository()

    /** mock needed function*/
    mockAuthenticationRepository.verifyRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationRepository.deleteRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    /** creating use case instance */
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository
    })

    // Action
    await deleteAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(
      mockAuthenticationRepository.verifyRefreshToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(
      mockAuthenticationRepository.deleteRefreshToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(
      mockAuthenticationRepository.verifyRefreshToken
    ).toHaveBeenCalledTimes(1)
    expect(
      mockAuthenticationRepository.deleteRefreshToken
    ).toHaveBeenCalledTimes(1)
  })
})
