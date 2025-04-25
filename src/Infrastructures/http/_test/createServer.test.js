import pool from '../../database/postgres/pool.js'
import bcrypt from 'bcrypt'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js'
import container from '../../container.js'
import createServer from '../createServer.js'
import BcryptPasswordHash from '../../security/BcryptPasswordHash.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({})
    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    })
    // Assert
    expect(response.statusCode).toEqual(404)
  })

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedUser).toBeDefined()
    })
  })

  it('should response 400 when request payload not contain needed property', async () => {
    // Arrange
    const requestPayload = {
      fullname: 'Dicoding Indonesia',
      password: 'secret'
    }
    const server = await createServer(container)
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })
    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(400)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
    )
  })
  it('should response 400 when request payload not meet data type specification', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: ['Dicoding Indonesia']
    }
    const server = await createServer(container)
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })
    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(400)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena tipe data tidak sesuai'
    )
  })
  it('should response 400 when username more than 50 character', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }
    const server = await createServer(container)
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })
    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(400)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena karakter username melebihi batas limit'
    )
  })
  it('should response 400 when username contain restricted character', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding indonesia',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }
    const server = await createServer(container)
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })
    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(400)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toEqual(
      'tidak dapat membuat user baru karena username mengandung karakter terlarang'
    )
  })
  it('should response 400 when username unavailable', async () => {
    // Arrange
    await UsersTableTestHelper.addUser({ username: 'dicoding' })
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret'
    }
    const server = await createServer(container)
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })
    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(400)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toEqual('username tidak tersedia')
  })

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret'
    }
    const server = await createServer({}) // fake container
    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })
    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami')
  })

  describe('when POST /authentications', () => {
    it('should response 201 and persisted authentication', async () => {
      // Arrange
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'super_secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const userData = {
        username: 'dicoding',
        password: hashedPassword
      }
      const requestPayload = {
        username: 'dicoding',
        password: plainPassword
      }
      const server = await createServer(container)
      await UsersTableTestHelper.addUser(userData)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.accessToken).toBeDefined()
      expect(responseJson.data.refreshToken).toBeDefined()
      expect(responseJson.data.refreshToken).not.toEqual(
        responseJson.data.accessToken
      )
    })
  })
  describe('when PUT /authentications', () => {
    it('should response 200 and return access token', async () => {
      // Arrange
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'super_secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const userData = {
        username: 'dicoding',
        password: hashedPassword
      }
      const server = await createServer(container)
      await UsersTableTestHelper.addUser(userData)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: plainPassword
        }
      })
      const { refreshToken } = JSON.parse(loginResponse.payload).data
      const requestPayload = {
        refreshToken
      }

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
    })
  })
  describe('when DELETE /authentications', () => {
    it('should response 200 and return success message', async () => {
      // Arrange
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'super_secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const userData = {
        username: 'dicoding',
        password: hashedPassword
      }
      const server = await createServer(container)
      await UsersTableTestHelper.addUser(userData)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: plainPassword
        }
      })
      const { refreshToken } = JSON.parse(loginResponse.payload).data
      const requestPayload = {
        refreshToken
      }

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.message).toEqual('Logout berhasil')
    })
  })
  describe('when POST /threads', () => {
    it('should response 401 when request not contain authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'dicoding indonesia'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const userData = {
        username: 'dicoding',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(userData)
      const requestPayload = {
        title: 'dicoding'
      }
      const server = await createServer(container)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret'
        }
      })
      const { accessToken } = JSON.parse(loginResponse.payload).data

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      )
    })
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const userData = {
        username: 'dicoding',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(userData)
      const requestPayload = {
        title: 'dicoding',
        body: 'dicoding indonesia'
      }
      const server = await createServer(container)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret'
        }
      })
      const { accessToken } = JSON.parse(loginResponse.payload).data

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(responseJson.message).not.toBeDefined()
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })
  })
})
