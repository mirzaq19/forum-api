import PasswordHash from '../../Applications/security/PasswordHash.js'
import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js'

export default class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super()
    this._bcrypt = bcrypt
    this._saltRound = saltRound
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound)
  }

  async compare(plain, hashed) {
    const match = await this._bcrypt.compare(plain, hashed)
    if (!match) {
      throw new AuthenticationError('kredensial yang anda masukkan salah')
    }
  }
}
