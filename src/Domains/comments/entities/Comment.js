class Comment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, username, date, content, like_count, is_deleted } = payload

    this.id = id
    this.username = username
    this.date = date
    this.likeCount = like_count
    this.content = is_deleted ? '**komentar telah dihapus**' : content
  }

  _verifyPayload({ id, username, date, content, like_count, is_deleted }) {
    if (
      !id ||
      !username ||
      !date ||
      !content ||
      like_count === undefined ||
      is_deleted === undefined
    ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof like_count !== 'number' ||
      typeof is_deleted !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }

  setReplies(replies) {
    if (!Array.isArray(replies)) {
      throw new Error('COMMENT.REPLIES_NOT_ARRAY')
    }
    if (replies.some(reply => typeof reply !== 'object')) {
      throw new Error('COMMENT.REPLIES_NOT_OBJECT')
    }
    this.replies = replies
  }
}

module.exports = Comment
