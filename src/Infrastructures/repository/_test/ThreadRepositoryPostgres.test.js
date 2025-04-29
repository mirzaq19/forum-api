import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js'
import NewThread from '../../../Domains/threads/entities/NewThread.js'
import pool from '../../database/postgres/pool.js'
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js'
import Thread from '../../../Domains/threads/entities/Thread.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'

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
      await UsersTableTestHelper.addUser({
        id: 'user-123qweqwe',
        username: 'dicoding-qweqwe'
      })
      const threadId = 'thread-123'
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        date: '2025-04-01T12:00:00.000Z',
        owner: 'user-123qweqwe'
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId)

      // Assert
      await UsersTableTestHelper.cleanTable()
      expect(thread).toEqual(
        new Thread({
          id: threadId,
          title: 'Thread Title',
          body: 'Thread Body',
          date: '2025-04-01T12:00:00.000Z',
          username: 'dicoding-qweqwe'
        })
      )
    })
  })
})
