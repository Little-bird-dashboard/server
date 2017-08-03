const knex = require('./knex')

module.exports = {
  getAllStudents: () => {
    return knex('student');
  },
  getOneStudentByID: (id) => {
    return knex('student').where('id', id).first();
  }
}
