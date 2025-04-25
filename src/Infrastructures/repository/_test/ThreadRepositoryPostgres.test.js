import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js'
import NewThread from '../../../Domains/thread/entities/NewThread.js'
import pool from '../../database/postgres/pool.js'
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js'

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
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
})
