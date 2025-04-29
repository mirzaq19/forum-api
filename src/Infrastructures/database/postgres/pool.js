/* istanbul ignore file */
const Postgres = require('pg')
const config = require('../../../Commons/config.js')

const pool = new Postgres.Pool(config.database)

module.exports = pool
