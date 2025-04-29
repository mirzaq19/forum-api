const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper.js')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres.js')
const NewThread = require('../../../Domains/threads/entities/NewThread.js')
const pool = require('../../database/postgres/pool.js')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError.js')
const Thread = require('../../../Domains/threads/entities/Thread.js')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper.js')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding',
        body: 'dicoding indonesia',
        owner: 'user-123'
      })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await threadRepositoryPostgres.addThread(newThread)

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123')
      expect(threads).toHaveLength(1)
    })
  })

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread('thread-123')
      ).rejects.toThrow(NotFoundError)
    })

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      const threadId = 'thread-123'
      await ThreadsTableTestHelper.addThread({ id: threadId })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread(threadId)
      ).resolves.not.toThrow(NotFoundError)
    })
  })
  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-123')
      ).rejects.toThrow(NotFoundError)
    })
    it('should return thread detail correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'

      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        date: '2025-04-01T12:00:00.000Z',
        owner: userId
      })

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId)

      // Assert
      expect(thread).toEqual(
        new Thread({
          id: threadId,
          title: 'Thread Title',
          body: 'Thread Body',
          date: '2025-04-01T12:00:00.000Z',
          username: 'dicoding'
        })
      )
    })
  })
})
