const NewThread = require('../NewThread.js')

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'New Thread'
    }

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: {}
    }

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should throw error when title contains more than 255 character', () => {
    // Arrange
    const payload = {
      title: 'a'.repeat(256),
      body: 'This is a new thread',
      owner: 'user-123'
    }

    // Action and Assert
    expect(() => new NewThread(payload)).toThrow('NEW_THREAD.TITLE_LIMIT_CHAR')
  })

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'New Thread',
      body: 'This is a new thread',
      owner: 'user-123'
    }

    // Action
    const newThread = new NewThread(payload)

    // Assert
    expect(newThread.title).toEqual(payload.title)
    expect(newThread.body).toEqual(payload.body)
    expect(newThread.owner).toEqual(payload.owner)
  })
})
