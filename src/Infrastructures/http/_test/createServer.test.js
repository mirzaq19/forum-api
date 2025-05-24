const pool = require('../../database/postgres/pool.js')
const bcrypt = require('bcrypt')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper.js')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper.js')
const container = require('../../container.js')
const createServer = require('../createServer.js')
const BcryptPasswordHash = require('../../security/BcryptPasswordHash.js')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper.js')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper.js')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTesHelper.js')

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
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
  describe('when POST /threads/{threadId}/comments', () => {
    beforeEach(async () => {
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const userData = {
        username: 'dicoding',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(userData)

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        owner: 'user-123'
      })
    })

    it('should response 401 when request not contain authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding indonesia'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/123/comments',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}
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
        url: '/threads/123/comments',
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
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      )
    })
    it('should response 404 when threadId not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding indonesia'
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
        url: '/threads/123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding indonesia'
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
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
      expect(responseJson.data.addedComment.id).toBeDefined()
      expect(responseJson.data.addedComment.content).toEqual(
        requestPayload.content
      )
      expect(responseJson.data.addedComment.owner).toBeDefined()
    })
  })
  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    beforeEach(async () => {
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const user1Data = {
        id: 'user-123',
        username: 'dicoding',
        password: hashedPassword
      }
      const user2Data = {
        id: 'user-124',
        username: 'dicoding2',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(user1Data)
      await UsersTableTestHelper.addUser(user2Data)

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })
    })

    it('should response 401 when request not contain authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 when threadId not found', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 404 when commentId not found', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })

    it('should response 403 when commentId not belong to the owner', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'anda tidak berhak mengakses resource ini'
      )
    })
    it('should response 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret'
        }
      })
      const { accessToken } = JSON.parse(loginResponse.payload).data

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
  describe('when GET /threads/{threadId}', () => {
    beforeEach(async () => {
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const user1Data = {
        id: 'user-123',
        username: 'dicoding',
        password: hashedPassword
      }
      const user2Data = {
        id: 'user-124',
        username: 'dicoding2',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(user1Data)
      await UsersTableTestHelper.addUser(user2Data)

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-124',
        threadId: 'thread-123',
        content: 'dicoding indonesia',
        owner: 'user-123'
      })
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })
    })

    it('should response 404 when threadId not found', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
      expect(responseJson.data.thread.id).toEqual('thread-123')
      expect(responseJson.data.thread.title).toEqual('dicoding')
      expect(responseJson.data.thread.body).toEqual('dicoding indonesia')
      expect(responseJson.data.thread.date).toBeDefined()
      expect(responseJson.data.thread.username).toEqual('dicoding')
      expect(responseJson.data.thread.comments).toBeDefined()
      expect(responseJson.data.thread.comments).toHaveLength(2)
      expect(responseJson.data.thread.comments[0].username).toEqual('dicoding2')
      expect(responseJson.data.thread.comments[1].username).toEqual('dicoding')
    })
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    beforeEach(async () => {
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const user1Data = {
        id: 'user-123',
        username: 'dicoding',
        password: hashedPassword
      }
      const user2Data = {
        id: 'user-124',
        username: 'dicoding2',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(user1Data)
      await UsersTableTestHelper.addUser(user2Data)

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })
    })

    it('should response 401 when request not contain authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding indonesia'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {}
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
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })
    it('should response 404 when threadId not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding indonesia'
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
        url: '/threads/123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
    it('should response 404 when commentId not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding indonesia'
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
        url: '/threads/thread-123/comments/123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'dicoding indonesia'
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
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
      expect(responseJson.data.addedReply.id).toBeDefined()
      expect(responseJson.data.addedReply.content).toEqual(
        requestPayload.content
      )
      expect(responseJson.data.addedReply.owner).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    beforeEach(async () => {
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const user1Data = {
        id: 'user-123',
        username: 'dicoding',
        password: hashedPassword
      }
      const user2Data = {
        id: 'user-124',
        username: 'dicoding2',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(user1Data)
      await UsersTableTestHelper.addUser(user2Data)

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })
    })

    it('should response 401 when request not contain authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })
    it('should response 404 when threadId not found', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
    it('should response 404 when commentId not found', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })
    it('should response 404 when replyId not found', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('reply tidak ditemukan')
    })
    it('should response 403 when replyId not belong to the owner', async () => {
      // Arrange
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
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'anda tidak berhak mengakses resource ini'
      )
    })
    it('should response 200 and delete reply', async () => {
      // Arrange
      const server = await createServer(container)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret'
        }
      })
      const { accessToken } = JSON.parse(loginResponse.payload).data

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    beforeEach(async () => {
      const passwordHash = new BcryptPasswordHash(bcrypt)
      const plainPassword = 'secret'
      const hashedPassword = await passwordHash.hash(plainPassword)
      const user1Data = {
        id: 'user-123',
        username: 'dicoding',
        password: hashedPassword
      }
      const user2Data = {
        id: 'user-124',
        username: 'dicoding2',
        password: hashedPassword
      }
      await UsersTableTestHelper.addUser(user1Data)
      await UsersTableTestHelper.addUser(user2Data)

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        owner: 'user-123'
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'dicoding indonesia',
        owner: 'user-124'
      })
    })

    it('should response 401 when request not contain authentication', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 when threadId not found', async () => {
      // Arrange
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
        method: 'PUT',
        url: '/threads/123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 404 when commentId not found', async () => {
      // Arrange
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
        method: 'PUT',
        url: '/threads/thread-123/comments/123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })

    it('should response 200 and like comment', async () => {
      // Arrange
      const server = await createServer(container)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret'
        }
      })
      const { accessToken } = JSON.parse(loginResponse.payload).data

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
    it('should response 200 and unlike comment', async () => {
      // Arrange
      const server = await createServer(container)
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret'
        }
      })
      const { accessToken } = JSON.parse(loginResponse.payload).data

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
