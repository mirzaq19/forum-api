const NewComment = require('../NewComment.js')

describe('a NewComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'This is a comment'
    }

    // Action and Assert
    expect(() => new NewComment(payload)).toThrow(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 123,
      owner: {}
    }

    // Action and Assert
    expect(() => new NewComment(payload)).toThrow(
      'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'This is a comment',
      owner: 'user-123'
    }

    // Action
    const newComment = new NewComment(payload)

    // Assert
    expect(newComment).toHaveProperty('content')
    expect(newComment).toHaveProperty('owner')
    expect(newComment.content).toEqual(payload.content)
    expect(newComment.owner).toEqual(payload.owner)
  })
})
