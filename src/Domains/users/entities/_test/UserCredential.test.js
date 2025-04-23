import UserCredential from '../UserCredential.js'

describe('an UserCredential entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc'
    }

    // Action and Assert
    expect(() => new UserCredential(payload)).toThrow(
      'USER_CREDENTIAL.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      password: true
    }
    // Action and Assert
    expect(() => new UserCredential(payload)).toThrow(
      'USER_CREDENTIAL.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create userCredential object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      password: 'secret_password'
    }

    // Action
    const userCredential = new UserCredential(payload)

    // Assert
    expect(userCredential.id).toEqual(payload.id)
    expect(userCredential.password).toEqual(payload.password)
  })
})
