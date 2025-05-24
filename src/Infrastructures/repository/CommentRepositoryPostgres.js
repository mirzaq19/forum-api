const AuthorizationError = require('../../Commons/exceptions/AuthorizationError.js')
const NotFoundError = require('../../Commons/exceptions/NotFoundError.js')
const CommentRepository = require('../../Domains/comments/CommentRepository.js')
const AddedComment = require('../../Domains/comments/entities/AddedComment.js')
const Comment = require('../../Domains/comments/entities/Comment.js')

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment({ threadId, content, owner }) {
    const id = `comment-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, new Date().toISOString(), 0, owner]
    }

    const result = await this._pool.query(query)

    return new AddedComment({ ...result.rows[0] })
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND is_deleted = false',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan')
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT id, owner FROM comments WHERE id = $1 AND is_deleted = false',
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan')
    }

    const comment = result.rows[0]
    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini')
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id]
    }

    await this._pool.query(query)
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, c.content, c.date, c.like_count, u.username, c.is_deleted
        FROM comments AS c
        JOIN users AS u ON c.owner = u.id
        WHERE c.thread_id = $1
        ORDER BY c.date ASC
      `,
      values: [threadId]
    }

    const result = await this._pool.query(query)
    return result.rows.map(
      row =>
        new Comment({
          ...row,
          date: row.date.toISOString()
        })
    )
  }

  async updateCommentLikeCount(commentId, likeCount) {
    const query = {
      text: 'UPDATE comments SET like_count = $1 WHERE id = $2',
      values: [likeCount, commentId]
    }

    await this._pool.query(query)
  }
}

module.exports = CommentRepositoryPostgres
