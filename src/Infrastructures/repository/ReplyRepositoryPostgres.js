const AddedReply = require('../../Domains/replies/entities/AddedReply.js')

class ReplyRepositoryPostgres {
  constructor(pool, idGenerator) {
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
}

module.exports = ReplyRepositoryPostgres
