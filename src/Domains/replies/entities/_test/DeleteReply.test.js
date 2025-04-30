const DeleteReply = require('../DeleteReply.js')

describe('a DeleteReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      replyId: 'reply-123'
    }

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrow(
      'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 123,
      owner: {}
    }

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrow(
      'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create DeleteReply object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }

    // Action
    const deleteReply = new DeleteReply(payload)

    // Assert
    expect(deleteReply).toHaveProperty('threadId')
    expect(deleteReply).toHaveProperty('commentId')
    expect(deleteReply).toHaveProperty('replyId')
    expect(deleteReply).toHaveProperty('owner')
    expect(deleteReply.threadId).toEqual(payload.threadId)
    expect(deleteReply.commentId).toEqual(payload.commentId)
    expect(deleteReply.replyId).toEqual(payload.replyId)
    expect(deleteReply.owner).toEqual(payload.owner)
  })
})
