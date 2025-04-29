const PasswordHash = require('../../Applications/security/PasswordHash.js')
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError.js')

class BcryptPasswordHash extends PasswordHash {
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

module.exports = BcryptPasswordHash
