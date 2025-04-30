/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool.js')

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'Reply Body',
    date = '2025-04-24T12:00:00.000Z',
    owner = 'user-123'
  } = {}) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, commentId, content, date, owner]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async findReplyByOwnerId(owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE owner = $1',
      values: [owner]
    }

    const result = await pool.query(query)
    return result.rows[0]
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE replies')
  }
}

module.exports = RepliesTableTestHelper
