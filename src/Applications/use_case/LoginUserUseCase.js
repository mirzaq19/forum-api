import NewAuth from '../../Domains/authentications/entities/NewAuth.js'
import LoginUser from '../../Domains/users/entities/LoginUser.js'

export default class LoginUserUseCase {
  constructor({
    userRepository,
    tokenManager,
    authenticationRepository,
    passwordHash
  }) {
    this._userRepository = userRepository
    this._tokenManager = tokenManager
    this._authenticationRepository = authenticationRepository
    this._passwordHash = passwordHash
  }
  async execute(useCasePayload) {
    const loginUser = new LoginUser(useCasePayload)
    const userCredential =
      await this._userRepository.getUserCredentialByUsername(loginUser.username)
    await this._passwordHash.compare(
      loginUser.password,
      userCredential.password
    )
    const accessToken = await this._tokenManager.generateAccessToken({
      sub: userCredential.id
    })
    const refreshToken = await this._tokenManager.generateRefreshToken({
      sub: userCredential.id
    })
    await this._authenticationRepository.addRefreshToken(refreshToken)
    return new NewAuth({ accessToken, refreshToken })
  }
}
