import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js'
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js'
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js'
import UserCredential from '../../../Domains/users/entities/UserCredential.js'
import pool from '../../database/postgres/pool.js'
import UserRepositoryPostgres from '../UserRepositoryPostgres.js'

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' }) // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding')
      ).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername('dicoding')
      ).resolves.not.toThrow(InvariantError)
    })
  })

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await userRepositoryPostgres.addUser(registerUser)

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123')
      expect(users).toHaveLength(1)
    })

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username: 'dicoding',
          fullname: 'Dicoding Indonesia'
        })
      )
    })
  })

  describe('getUserCredentialByUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ username: 'dicoding' })

      // Action & Assert
      await expect(
        userRepositoryPostgres.getUserCredentialByUsername('wrong_username')
      ).rejects.toThrow(InvariantError)
    })

    it('should return user id and password when username exists', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'hashed_password'
      })

      // Action
      const userCredential =
        await userRepositoryPostgres.getUserCredentialByUsername('dicoding')

      // Assert
      expect(userCredential).toStrictEqual(
        new UserCredential({
          id: 'user-123',
          password: 'hashed_password'
        })
      )
    })
    describe('verifyUserExists function', () => {
      it('should throw NotFoundError when user not found', async () => {
        // Arrange
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

        // Action & Assert
        await expect(
          userRepositoryPostgres.verifyUserExists('user-123')
        ).rejects.toThrow(NotFoundError)
      })

      it('should not throw NotFoundError when user found', async () => {
        // Arrange
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})
        await UsersTableTestHelper.addUser({ id: 'user-123' })

        // Action & Assert
        await expect(
          userRepositoryPostgres.verifyUserExists('user-123')
        ).resolves.not.toThrow(NotFoundError)
      })
    })
  })
})
