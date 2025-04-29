const bcrypt = require('bcrypt')
const BcryptPasswordHash = require('../BcryptPasswordHash.js')
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError.js')

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password')

      // Assert
      expect(typeof encryptedPassword).toEqual('string')
      expect(encryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10) // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    })
  })
  describe('compare function', () => {
    it('should return false when password did not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)
      const hashedPassword = await bcryptPasswordHash.hash('plain_password')

      // Action and Assert
      await expect(
        bcryptPasswordHash.compare('wrong_password', hashedPassword)
      ).rejects.toThrow(AuthenticationError)
    })
    it('should compare password correctly', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare')
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt)
      const hashedPassword = await bcryptPasswordHash.hash('plain_password')

      // Action and Assert
      await expect(
        bcryptPasswordHash.compare('plain_password', hashedPassword)
      ).resolves.not.toThrow()
      expect(spyCompare).toHaveBeenCalledWith('plain_password', hashedPassword)
    })
  })
})
