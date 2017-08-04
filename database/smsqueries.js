const knex = require('./knex')

module.exports = {
  insertOneCommunication: () => {
    return knex('student');
  }
}
