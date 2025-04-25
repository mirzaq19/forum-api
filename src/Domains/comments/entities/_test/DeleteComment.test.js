import DeleteComment from '../DeleteComment.js'

describe('a DeleteComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrow(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 123,
      owner: {}
    }

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrow(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create DeleteComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    // Action
    const deleteComment = new DeleteComment(payload)

    // Assert
    expect(deleteComment).toHaveProperty('threadId')
    expect(deleteComment).toHaveProperty('commentId')
    expect(deleteComment).toHaveProperty('owner')
    expect(deleteComment.threadId).toEqual(payload.threadId)
    expect(deleteComment.commentId).toEqual(payload.commentId)
    expect(deleteComment.owner).toEqual(payload.owner)
  })
})
