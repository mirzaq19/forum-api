const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository.js')

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async getCommentLikeId(commentId, owner) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND owner = $2 LIMIT 1',
      values: [commentId, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      return null
    }

    return result.rows[0].id
  }

  async addCommentLike({ commentId, owner }) {
    const id = `comment-like-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, owner]
    }

    await this._pool.query(query)
  }

  async deleteCommentLike(commentLikeId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE id = $1',
      values: [commentLikeId]
    }

    await this._pool.query(query)
  }

  async getCommentLikeCount(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)
    return parseInt(result.rows[0].count, 10)
  }
}

module.exports = CommentLikeRepositoryPostgres
