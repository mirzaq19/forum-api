import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js'
import NewThread from '../../../Domains/thread/entities/NewThread.js'
import pool from '../../database/postgres/pool.js'

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
})
