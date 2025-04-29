const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper.js')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres.js')
const NewComment = require('../../../Domains/comments/entities/NewComment.js')
const pool = require('../../database/postgres/pool.js')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError.js')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError.js')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper.js')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Comment Body',
        owner: 'user-123'
      })
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      // Action
      await commentRepositoryPostgres.addComment(newComment)

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        'comment-123'
      )
      expect(comments).toHaveLength(1)
    })
  })
  describe('verifyAvailableComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentId = 'comment-123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment(commentId)
      ).rejects.toThrow(NotFoundError)
    })

    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const commentId = 'comment-123'
      await CommentsTableTestHelper.addComment({ id: commentId })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment(commentId)
      ).resolves.not.toThrow(NotFoundError)
    })
  })
  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentId = 'comment-123'
      const owner = 'user-123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, owner)
      ).rejects.toThrow(NotFoundError)
    })

    it('should throw AuthorizationError when owner not match', async () => {
      // Arrange
      const commentId = 'comment-123'
      const owner = 'user-123'
      await CommentsTableTestHelper.addComment({ id: commentId, owner })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, 'other-user')
      ).rejects.toThrow(AuthorizationError)
    })

    it('should not throw NotFoundError when owner match', async () => {
      // Arrange
      const commentId = 'comment-123'
      const owner = 'user-123'
      await CommentsTableTestHelper.addComment({ id: commentId, owner })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(commentId, owner)
      ).resolves.not.toThrow(NotFoundError)
    })
  })
  describe('deleteCommentById function', () => {
    it('should delete comment by id', async () => {
      // Arrange
      const commentId = 'comment-123'
      await CommentsTableTestHelper.addComment({ id: commentId })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId)

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(commentId)
      expect(comments).toHaveLength(1)
      expect(comments[0].is_deleted).toEqual(true)
    })
  })
  describe('getCommentsByThreadId function', () => {
    it('should return empty array when no comments', async () => {
      // Arrange
      const threadId = 'thread-123'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      )

      // Assert
      expect(comments).toHaveLength(0)
    })

    it('should return comments by thread id', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      const threadId = 'thread-123'
      await CommentsTableTestHelper.addComment({ threadId, owner: 'user-123' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        threadId
      )

      // Assert
      await UsersTableTestHelper.cleanTable()
      expect(comments).toHaveLength(1)
    })
  })
})
