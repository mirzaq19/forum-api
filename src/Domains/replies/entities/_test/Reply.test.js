const Reply = require('../Reply.js')

describe('a Reply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a reply'
    }

    // Action and Assert
    expect(() => new Reply(payload)).toThrow(
      'REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
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
    expect(() => new Reply(payload)).toThrow(
      'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should return delete message when payload is_deleted is true', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a reply',
      is_deleted: true
    }

    // Action
    const reply = new Reply(payload)

    // Assert
    expect(reply.content).toEqual('**balasan telah dihapus**')
  })
  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a reply',
      is_deleted: false
    }

    // Action
    const reply = new Reply(payload)

    // Assert
    expect(reply).toHaveProperty('id')
    expect(reply).toHaveProperty('username')
    expect(reply).toHaveProperty('date')
    expect(reply).toHaveProperty('content')
    expect(reply.id).toEqual(payload.id)
    expect(reply.username).toEqual(payload.username)
    expect(reply.date).toEqual(payload.date)
    expect(reply.content).toEqual(payload.content)
  })
})
