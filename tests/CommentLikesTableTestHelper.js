/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool.js')

const CommentLikesTableTestHelper = {
  async addCommentLike({
    id = 'comment-like-123',
    commentId = 'comment-123',
    owner = 'user-123',
    date = '2025-04-24T12:00:00.000Z'
  } = {}) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, commentId, owner, date]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async findCommentLikesById(id) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comment_likes')
  }
}

module.exports = CommentLikesTableTestHelper
