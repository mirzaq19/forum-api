const CommentLikeRepository = require('../CommentLikeRepository.js')

describe('NewCommentLikeRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository()

    // Action and Assert
    await expect(
      commentLikeRepository.getCommentLikeId('commentId', 'owner')
    ).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(commentLikeRepository.addCommentLike({})).rejects.toThrow(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )

    await expect(
      commentLikeRepository.deleteCommentLike('commentLikeId')
    ).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(
      commentLikeRepository.getCommentLikeCount('commentId')
    ).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
