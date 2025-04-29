const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository.js')
const LoginUser = require('../../../Domains/users/entities/LoginUser.js')
const UserRepository = require('../../../Domains/users/UserRepository.js')
const TokenManager = require('../../security/TokenManager.js')
const LoginUserUseCase = require('../LoginUserUseCase.js')
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError.js')
const NewAuth = require('../../../Domains/authentications/entities/NewAuth.js')
const UserCredential = require('../../../Domains/users/entities/UserCredential.js')
const PasswordHash = require('../../security/PasswordHash.js')
const InvariantError = require('../../../Commons/exceptions/InvariantError.js')

describe('LoginUserUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'plain_password'
    }

    const mockLoginUser = new LoginUser({
      username: useCasePayload.username,
      password: useCasePayload.password
    })

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockTokenManager = new TokenManager()

    /** mocking needed function */
    mockUserRepository.getUserCredentialByUsername = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          new UserCredential({
            id: 'user-123',
            password: 'secret'
          })
        )
      )
    mockPasswordHash.compare = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockTokenManager.generateAccessToken = jest
      .fn()
      .mockImplementation(() => 'access_token')
    mockTokenManager.generateRefreshToken = jest
      .fn()
      .mockImplementation(() => 'refresh_token')
    mockAuthenticationRepository.addRefreshToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    /** creating use case instance */
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      tokenManager: mockTokenManager,
      passwordHash: mockPasswordHash,
      authenticationRepository: mockAuthenticationRepository
    })

    // Action
    const authenticationToken = await loginUserUseCase.execute(useCasePayload)
    // Assert
    expect(authenticationToken).toStrictEqual(
      new NewAuth({
        accessToken: 'access_token',
        refreshToken: 'refresh_token'
      })
    )
    expect(mockUserRepository.getUserCredentialByUsername).toHaveBeenCalledWith(
      mockLoginUser.username
    )
    expect(mockPasswordHash.compare).toHaveBeenCalledWith(
      mockLoginUser.password,
      'secret'
    )

    expect(mockTokenManager.generateAccessToken).toHaveBeenCalledWith({
      sub: 'user-123'
    })
    expect(mockTokenManager.generateRefreshToken).toHaveBeenCalledWith({
      sub: 'user-123'
    })
    expect(mockAuthenticationRepository.addRefreshToken).toHaveBeenCalledWith(
      'refresh_token'
    )
  })

  it('should orchestrating the login action correctly with no available username', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'wrong_password'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()

    /** mocking needed function */
    mockUserRepository.getUserCredentialByUsername = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new InvariantError('user belum terdaftar'))
      )

    /** creating use case instance */
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      tokenManager: {},
      authenticationRepository: {}
    })

    // Action and Assert
    await expect(loginUserUseCase.execute(useCasePayload)).rejects.toThrow(
      'user belum terdaftar'
    )
    expect(mockUserRepository.getUserCredentialByUsername).toHaveBeenCalledWith(
      useCasePayload.username
    )
  })
  it('should orchestrating the login action correctly with wrong password', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'wrong_password'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    /** mocking needed function */
    mockUserRepository.getUserCredentialByUsername = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          new UserCredential({
            id: 'user-123',
            password: 'hashed_password'
          })
        )
      )
    mockPasswordHash.compare = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(
          new AuthenticationError('kredensial yang anda masukkan salah')
        )
      )

    /** creating use case instance */
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      tokenManager: {},
      authenticationRepository: {},
      passwordHash: mockPasswordHash
    })

    // Action and Assert
    await expect(loginUserUseCase.execute(useCasePayload)).rejects.toThrow(
      'kredensial yang anda masukkan salah'
    )
  })
})
