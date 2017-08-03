const knex = require('./knex')

module.exports = {
  getAllStudents: () => {
    return knex('student');
  },
  getOneStudentByID: (id) => {
    return knex('student AS s')
    .select('s.*', 'gt.name AS grade_name', 'sh.first_name AS guardian_first_name', 'sh.last_name AS guardian_last_name', 'sh.cell AS guardian_cell')
    .innerJoin('grade_type AS gt', 'gt.id', 'grade_type_id')
    .innerJoin('student_stakeholder AS ss','s.id','ss.student_id')
    .innerJoin('stakeholder AS sh', 'sh.id', 'ss.stakeholder_id')
    .innerJoin('stakeholder_type AS st','sh.stakeholder_type_id','st.id')
    .where('st.id',2)
    .where('s.id', id)
    .first();
  },
  getCommunicationsByStudent: (id) => {
    return knex('communication AS c')
    .select('c.*', 'ct.type AS communication_type', 's.first_name','s.last_name', 'st.type as stakeholder_type')
    .innerJoin('stakeholder AS s', 'c.stakeholder_id', 's.id')
    .innerJoin('communication_type AS ct','c.communication_type_id','ct.id')
    .innerJoin('stakeholder_type AS st','s.stakeholder_type_id','st.id')
    .where('c.student_id', id)
  },
  updateStudentByID: (id, student) => {
    return knex('student').where('id', id).update(student).returning('*');
  }
}
