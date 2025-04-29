const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository.js')
const TokenManager = require('../../security/TokenManager.js')
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase.js')

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error when payload did not contain refreshToken', async () => {
    // Arrange
    const useCasePayload = {}
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})
    // Action and Assert
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    )
  })
  it('should throw error when payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123
    }
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})
    // Action and Assert
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should orchestrating the refresh access token action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token'
    }

    /** creating dependency of use case */
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockTokenManager = new TokenManager()

    /** mock needed function*/
    mockAuthenticationRepository.verifyRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => ({
      sub: 'user-123'
    }))
    mockTokenManager.generateAccessToken = jest
      .fn()
      .mockImplementation(() => 'access_token')

    /** creating use case instance */
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      tokenManager: mockTokenManager
    })

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(
      useCasePayload
    )

    // Assert
    expect(accessToken).toEqual('access_token')
    expect(
      mockAuthenticationRepository.verifyRefreshToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockTokenManager.verifyRefreshToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    )
    expect(mockTokenManager.generateAccessToken).toHaveBeenCalledWith({
      sub: 'user-123'
    })
    expect(mockTokenManager.generateAccessToken).toHaveBeenCalledTimes(1)
    expect(
      mockAuthenticationRepository.verifyRefreshToken
    ).toHaveBeenCalledTimes(1)
    expect(mockTokenManager.verifyRefreshToken).toHaveBeenCalledTimes(1)
  })
})
