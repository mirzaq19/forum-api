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
}
