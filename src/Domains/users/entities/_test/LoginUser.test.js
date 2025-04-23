import LoginUser from '../LoginUser.js'

describe('a LoginUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: '',
      password: 'abc'
    }

    // Action and Assert
    expect(() => new LoginUser(payload)).toThrow(
      'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      password: true
    }
    // Action and Assert
    expect(() => new LoginUser(payload)).toThrow(
      'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create loginUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'abc'
    }

    // Action
    const { username, password } = new LoginUser(payload)

    // Assert
    expect(username).toEqual(payload.username)
    expect(password).toEqual(payload.password)
  })
})
