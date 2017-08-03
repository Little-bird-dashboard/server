const knex = require('./knex')

module.exports = {
  getAllStudents: () => {
    return knex('student');
  }
}
