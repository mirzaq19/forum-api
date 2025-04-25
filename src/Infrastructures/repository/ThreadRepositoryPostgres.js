import AddedThread from '../../Domains/thread/entities/AddedThread.js'
import ThreadRepository from '../../Domains/thread/ThreadRepository.js'
import NotFoundError from '../../Commons/exceptions/NotFoundError.js'

export default class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread({ title, body, owner }) {
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, new Date().toISOString(), owner]
    }

    const result = await this._pool.query(query)

    return new AddedThread({ ...result.rows[0] })
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan')
    }
  }
}
