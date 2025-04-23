/* istanbul ignore file */
import Postgres from 'pg'
import config from '../../../Commons/config.js'

const pool = new Postgres.Pool(config.database)

export default pool
