const pool = require('../../database/postgres/pool.js')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres.js')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTesHelper.js')

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      // Arrange
      const newReply = {
        commentId: 'comment-123',
        content: 'Reply Body',
        owner: 'user-123'
      }
      const fakeIdGenerator = () => '123' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await replyRepositoryPostgres.addReply(newReply)

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123')
      expect(replies).toHaveLength(1)
    })
  })
})
