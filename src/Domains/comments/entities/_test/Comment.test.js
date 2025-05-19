const Comment = require('../Comment.js')

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
      'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: '2023-10-01T12:00:00.000Z',
      content: {},
      like_count: '100',
      is_deleted: 'true'
    }

    // Action and Assert
    expect(() => new Comment(payload)).toThrow(
      'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should return delete message when payload is_deleted is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      like_count: 0,
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
      like_count: 0,
      is_deleted: false
    }

    // Action
    const comment = new Comment(payload)

    // Assert
    expect(comment).toHaveProperty('id')
    expect(comment).toHaveProperty('username')
    expect(comment).toHaveProperty('date')
    expect(comment).toHaveProperty('content')
    expect(comment).toHaveProperty('likeCount')
    expect(comment.id).toEqual(payload.id)
    expect(comment.username).toEqual(payload.username)
    expect(comment.date).toEqual(payload.date)
    expect(comment.content).toEqual(payload.content)
    expect(comment.likeCount).toEqual(payload.like_count)
  })

  it('should throw error when replies is not an array', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      like_count: 0,
      is_deleted: false
    }
    const comment = new Comment(payload)

    // Action and Assert
    expect(() => comment.setReplies('not an array')).toThrow(
      'COMMENT.REPLIES_NOT_ARRAY'
    )
  })

  it('should throw error when replies is not an object', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      like_count: 0,
      is_deleted: false
    }
    const comment = new Comment(payload)

    // Action and Assert
    expect(() => comment.setReplies(['reply'])).toThrow(
      'COMMENT.REPLIES_NOT_OBJECT'
    )
  })
  it('should set replies correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      like_count: 0,
      is_deleted: false
    }
    const comment = new Comment(payload)
    const replies = [{ id: 'reply-123', content: 'Reply' }]

    // Action
    comment.setReplies(replies)

    // Assert
    expect(comment.replies).toEqual(replies)
  })
})
