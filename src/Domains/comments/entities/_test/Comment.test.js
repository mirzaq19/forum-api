import Comment from '../Comment.js'

describe('a Comment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment'
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrow(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: '2023-10-01T12:00:00.000Z',
      content: {},
      is_deleted: 'true'
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrow(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should return delete message when payload is_deleted is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      is_deleted: true
    }

    // Action
    const comment = new Comment(payload)

    // Assert
    expect(comment.content).toEqual('**komentar telah dihapus**')
  })
  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      is_deleted: false
    }

    // Action
    const comment = new Comment(payload)

    // Assert
    expect(comment).toHaveProperty('id')
    expect(comment).toHaveProperty('username')
    expect(comment).toHaveProperty('date')
    expect(comment).toHaveProperty('content')
    expect(comment.id).toEqual(payload.id)
    expect(comment.username).toEqual(payload.username)
    expect(comment.date).toEqual(payload.date)
    expect(comment.content).toEqual(payload.content)
  })
})
