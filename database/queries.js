const knex = require('./knex')

module.exports = {
  getAllStudents: () => {
    return knex('student');
  },
  getOneStudentByID: (id) => {
    return knex('student').innerJoin('grade_type as gt', 'gt.id', 'grade_type_id').where('id', id).first();
  },
  updateStudentByID: (id, student) => {
    return knex('student').where('id', id).update(student).returning('*');
  }
}
