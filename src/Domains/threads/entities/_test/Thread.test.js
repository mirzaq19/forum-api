const Thread = require('../Thread.js')

describe('a Thread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body'
    }

    // Action and Assert
    expect(() => new Thread(payload)).toThrow(
      'THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      body: {},
      date: '2023-10-01T12:00:00.000Z',
      username: 'user-123',
      comments: true
    }

    // Action and Assert
    expect(() => new Thread(payload)).toThrow(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create Thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T12:00:00.000Z',
      username: 'user-123'
    }

    // Action
    const thread = new Thread(payload)

    // Assert
    expect(thread).toHaveProperty('id')
    expect(thread).toHaveProperty('title')
    expect(thread).toHaveProperty('body')
    expect(thread).toHaveProperty('date')
    expect(thread).toHaveProperty('username')
    expect(thread.id).toEqual(payload.id)
    expect(thread.title).toEqual(payload.title)
    expect(thread.body).toEqual(payload.body)
    expect(thread.date).toEqual(payload.date)
    expect(thread.username).toEqual(payload.username)
  })
  it('should throw error when comments is not an array', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T12:00:00.000Z',
      username: 'user-123'
    }
    const thread = new Thread(payload)

    // Action and Assert
    expect(() => thread.setComments({})).toThrow('THREAD.COMMENTS_NOT_ARRAY')
  })
  it('should throw error when comments is not an object', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T12:00:00.000Z',
      username: 'user-123'
    }
    const thread = new Thread(payload)

    // Action and Assert
    expect(() => thread.setComments(['comment'])).toThrow(
      'THREAD.COMMENTS_NOT_OBJECT'
    )
  })
  it('should set comments correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T12:00:00.000Z',
      username: 'user-123'
    }
    const thread = new Thread(payload)
    const comments = [{ id: 'comment-123', content: 'Comment' }]

    // Action
    thread.setComments(comments)

    // Assert
    expect(thread.comments).toEqual(comments)
  })
})
