const pool = require('../../database/postgres/pool.js')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres.js')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTesHelper.js')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper.js')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError.js')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError.js')

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('getRepliesByCommentIds function', () => {
    it('should throw error when commentIds is not an array', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      const commentIds = 'not-an-array'

      // Action and Assert
      await expect(
        replyRepositoryPostgres.getRepliesByCommentIds(commentIds)
      ).rejects.toThrow(
        'REPLY_REPOSITORY.GET_REPLIES_BY_COMMENT_IDS.NOT_AN_ARRAY'
      )
    })
    it('should throw error when commentIds is an empty array', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      const commentIds = []

      // Action and Assert
      expect(
        replyRepositoryPostgres.getRepliesByCommentIds(commentIds)
      ).resolves.toEqual([])
    })
    it('should return empty array when no replies found', async () => {
      // Arrange
      const commentId = 'comment-123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds([
        commentId
      ])

      // Assert
      expect(replies).toHaveLength(0)
    })
    it('should persist get replies by comment ids', async () => {
      // Arrange
      const userId = 'user-123'
      const username = 'dicoding'
      const commentId = 'comment-123'
      await UsersTableTestHelper.addUser({ id: userId, username })
      await RepliesTableTestHelper.addReply({ commentId, owner: userId })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds([
        commentId
      ])

      // Assert
      expect(replies).toHaveLength(1)
      expect(replies[0].id).toBeDefined()
      expect(replies[0].comment_id).toEqual(commentId)
      expect(replies[0].content).toBeDefined()
      expect(replies[0].date).toBeDefined()
      expect(replies[0].username).toBeDefined()
      expect(replies[0].username).toEqual(username)
      expect(replies[0].is_deleted).toBeDefined()
    })
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

  describe('verifyAvailableReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      const replyId = 'reply-123'

      // Action and Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReply(replyId)
      ).rejects.toThrow(NotFoundError)
    })

    it('should not throw NotFoundError when reply found', async () => {
      // Arrange
      const replyId = 'reply-123'
      await RepliesTableTestHelper.addReply({ id: replyId })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReply(replyId)
      ).resolves.not.toThrow(NotFoundError)
    })
  })

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      const replyId = 'reply-123'

      // Action and Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-123')
      ).rejects.toThrow(NotFoundError)
    })
    it('should throw AuthorizationError when reply owner not match', async () => {
      // Arrange
      const replyId = 'reply-123'
      const owner = 'user-456'
      await RepliesTableTestHelper.addReply({ id: replyId, owner })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(replyId, 'user-123')
      ).rejects.toThrow(AuthorizationError)
    })

    it('should not throw AuthorizationError when reply owner match', async () => {
      // Arrange
      const replyId = 'reply-123'
      const owner = 'user-123'
      await RepliesTableTestHelper.addReply({ id: replyId, owner })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(replyId, owner)
      ).resolves.not.toThrow(AuthorizationError)
    })
  })

  describe('deleteReplyById function', () => {
    it('should delete reply by id', async () => {
      // Arrange
      const replyId = 'reply-123'
      await RepliesTableTestHelper.addReply({ id: replyId })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId)

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById(replyId)
      expect(replies).toHaveLength(1)
      expect(replies[0].is_deleted).toEqual(true)
    })
  })
})
