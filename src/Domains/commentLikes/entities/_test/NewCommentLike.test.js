const NewCommentLike = require('../NewCommentLike.js')

describe('a NewCommentLike entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123'
    }

    // Action and Assert
    expect(() => new NewCommentLike(payload)).toThrow(
      'NEW_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: true,
      commentId: 123,
      owner: {}
    }

    // Action and Assert
    expect(() => new NewCommentLike(payload)).toThrow(
      'NEW_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create NewCommentLike object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    // Action
    const newCommentLike = new NewCommentLike(payload)

    // Assert
    expect(newCommentLike).toHaveProperty('threadId')
    expect(newCommentLike).toHaveProperty('commentId')
    expect(newCommentLike).toHaveProperty('owner')
    expect(newCommentLike.commentId).toEqual(payload.commentId)
    expect(newCommentLike.owner).toEqual(payload.owner)
  })
})
