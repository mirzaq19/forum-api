const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper.js')
const pool = require('../../database/postgres/pool.js')
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres.js')

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('getCommentLikeId function', () => {
    it('should return null when comment like not found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      )

      const commentId = 'comment-123'
      const owner = 'user-123'

      // Action
      const result = await commentLikeRepositoryPostgres.getCommentLikeId(
        commentId,
        owner
      )

      // Assert
      expect(result).toBeNull()
    })

    it('should return comment like id when comment like found', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      )

      const commentId = 'comment-123'
      const owner = 'user-123'

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'comment-like-123',
        commentId,
        owner
      })

      // Action
      const result = await commentLikeRepositoryPostgres.getCommentLikeId(
        commentId,
        owner
      )

      // Assert
      expect(result).toEqual('comment-like-123')
    })
  })

  describe('addCommentLike function', () => {
    it('should persist comment like and return id', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      const commentId = 'comment-123'
      const owner = 'user-123'

      // Action
      await commentLikeRepositoryPostgres.addCommentLike({
        commentId,
        owner
      })

      // Assert
      const result = await CommentLikesTableTestHelper.findCommentLikesById(
        'comment-like-123'
      )
      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('id', 'comment-like-123')
      expect(result[0]).toHaveProperty('comment_id', commentId)
      expect(result[0]).toHaveProperty('owner', owner)
    })
  })

  describe('deleteCommentLike function', () => {
    it('should delete comment like by id', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      )

      const commentId = 'comment-123'
      const owner = 'user-123'

      const commentLikeId = await CommentLikesTableTestHelper.addCommentLike({
        commentId,
        owner
      })

      // Action
      const resultBeforeDelete =
        await CommentLikesTableTestHelper.findCommentLikesById(commentLikeId)
      await commentLikeRepositoryPostgres.deleteCommentLike(commentLikeId)

      // Assert
      const resultAfterDelete =
        await CommentLikesTableTestHelper.findCommentLikesById(commentLikeId)
      expect(resultBeforeDelete).toHaveLength(1)
      expect(resultBeforeDelete[0]).toHaveProperty('id', commentLikeId)
      expect(resultBeforeDelete[0]).toHaveProperty('comment_id', commentId)
      expect(resultBeforeDelete[0]).toHaveProperty('owner', owner)
      expect(resultAfterDelete).toHaveLength(0)
      expect(resultAfterDelete).toEqual([])
    })
  })

  describe('getCommentLikeCount function', () => {
    it('should return the count of comment likes', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        {}
      )

      const commentId = 'comment-123'
      const owner = 'user-123'

      await CommentLikesTableTestHelper.addCommentLike({
        commentId,
        owner
      })

      // Action
      const result = await commentLikeRepositoryPostgres.getCommentLikeCount(
        commentId
      )

      // Assert
      expect(result).toEqual(1)
    })
  })
})
