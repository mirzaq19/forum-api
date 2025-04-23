export default class UserCredential {
  constructor(payload) {
    this._verifyPayload(payload)
    const { id, password } = payload
    this.id = id
    this.password = password
  }

  _verifyPayload({ id, password }) {
    if (!id || !password) {
      throw new Error('USER_CREDENTIAL.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (typeof id !== 'string' || typeof password !== 'string') {
      throw new Error('USER_CREDENTIAL.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
