import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js'
import NewComment from '../../../Domains/comments/entities/NewComment.js'
import pool from '../../database/postgres/pool.js'

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
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
})
