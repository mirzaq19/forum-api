/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'Thread Title',
    body = 'Thread Body',
    date = '2025-04-24T12:00:00.000Z',
    owner = 'user-123'
  } = {}) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, title, body, date, owner]
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async findThreadByOwnerId(owner) {
    const query = {
      text: 'SELECT * FROM threads WHERE owner = $1',
      values: [owner]
    }

    const result = await pool.query(query)
    return result.rows[0]
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads')
  }
}

export default ThreadsTableTestHelper
