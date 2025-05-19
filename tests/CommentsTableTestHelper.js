/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool.js')

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'Comment Body',
    date = '2025-04-24T12:00:00.000Z',
    owner = 'user-123'
  } = {}) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, threadId, content, date, 0, owner]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async findCommentByOwnerId(owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE owner = $1',
      values: [owner]
    }

    const result = await pool.query(query)
    return result.rows[0]
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments')
  }
}

module.exports = CommentsTableTestHelper
