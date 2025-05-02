class Reply {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, username, date, content, is_deleted } = payload

    this.id = id
    this.username = username
    this.date = date
    this.content = is_deleted ? '**balasan telah dihapus**' : content
  }

  _verifyPayload({ id, username, date, content, is_deleted }) {
    if (!id || !username || !date || !content || is_deleted === undefined) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof is_deleted !== 'boolean'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Reply
