const AuthorizationError = require('../../Commons/exceptions/AuthorizationError.js')
const NotFoundError = require('../../Commons/exceptions/NotFoundError.js')
const AddedReply = require('../../Domains/replies/entities/AddedReply.js')
const ReplyRepository = require('../../Domains/replies/ReplyRepository.js')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReply({ commentId, content, owner }) {
    const id = `reply-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO replies (id, comment_id, content, owner) VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, content, owner]
    }

    const result = await this._pool.query(query)
    return new AddedReply({ ...result.rows[0] })
  }

  async verifyAvailableReply(replyId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('reply tidak ditemukan')
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('reply tidak ditemukan')
    }

    const { owner: replyOwner } = result.rows[0]
    if (replyOwner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini')
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [replyId]
    }

    await this._pool.query(query)
  }
}

module.exports = ReplyRepositoryPostgres
