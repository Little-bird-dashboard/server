const knex = require('./knex');

module.exports = {
  getAllStudents: () => {
    return knex('student')
    .select(knex.raw('student.*, max(timestamp) as last_communication'))
    .leftJoin('communication as comm', 'comm.student_id', 'student.id' )
    .groupBy('student.id');
  },
  getOneStudentByID: (id) => {
    return knex('student AS s')
    .select('s.*', 'gt.name AS grade_name')
    .leftJoin('grade_type AS gt', 'gt.id', 'grade_type_id')
    .where('s.id', id);
  },
  getStakeholdersByStudentID: (id) => {
    return knex('student_stakeholder AS ss')
    .select('sh.*', 'st.id as stakeholder_type_id', 'st.type as stakeholder_type')
    .leftJoin('stakeholder AS sh','sh.id', 'ss.stakeholder_id')
    .leftJoin('stakeholder_type AS st', 'sh.stakeholder_type_id','st.id')
    .where('ss.student_id', id);
  },
  getCommunicationsByStudent: (id) => {
    return knex('communication AS c')
    .select('c.*', 'ct.type AS communication_type', 's.first_name','s.last_name', 'st.type as stakeholder_type')
    .innerJoin('stakeholder AS s', 'c.stakeholder_id', 's.id')
    .innerJoin('communication_type AS ct','c.communication_type_id','ct.id')
    .innerJoin('stakeholder_type AS st','s.stakeholder_type_id','st.id')
    .where('c.student_id', id);
  },
  updateStudentByID: (id, student) => {
    return knex('student').where('id', id).update(student).returning('*');
  }
};
