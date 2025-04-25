import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js'
import NotFoundError from '../../Commons/exceptions/NotFoundError.js'
import AddedComment from '../../Domains/comments/entities/AddedComment.js'

export default class CommentRepositoryPostgres {
  constructor(pool, idGenerator) {
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment({ threadId, content, owner }) {
    const id = `comment-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, content, new Date().toISOString(), owner]
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
}
