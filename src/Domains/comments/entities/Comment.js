export default class Comment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, username, date, content, is_deleted } = payload

    this.id = id
    this.username = username
    this.date = date
    this.content = is_deleted ? '**komentar telah dihapus**' : content
  }

  _verifyPayload({ id, username, date, content, is_deleted }) {
    if (!id || !username || !date || !content || is_deleted === undefined) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof is_deleted !== 'boolean'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
