const AddedThread = require('../AddedThread.js')

describe('an AddedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'a thread title',
      body: 'a thread body'
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      owner: {}
    }

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrow(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread title',
      owner: 'user-123'
    }

    // Action
    const { id, title, owner } = new AddedThread(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(title).toEqual(payload.title)
    expect(owner).toEqual(payload.owner)
  })
})
