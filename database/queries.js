const knex = require('./knex');

module.exports = {
  getAllStudents: () => {
    return knex('student')
    .select(knex.raw('student.*, max(timestamp) as last_communication'))
    .leftJoin('communication as comm', 'comm.student_id', 'student.id' )
    .groupBy('student.id');
  },
  getAllStudentsAdmin: () => {
    return knex('student as s')
    .select('s.*', 'l.name', 'st.first_name', 'st.last_name', 'school.name', 'gt.name')
    .innerJoin('school', 'school.id', 's.school_id')
    .leftJoin('language as l', 'l.id', 's.language_id')
    .innerJoin('student_stakeholder as ss', 'ss.student_id', 's.id')
    .innerJoin('stakeholder st', 'st.id', 'ss.stakeholder_id')
    .leftJoin('grade_type as gt', 'gt.id', 's.grade_type_id')
    .where('st.stakeholder_type_id', 1);
  },
  getAllStudentsByTeacher: (id) => {
    return knex('student_stakeholder as ss')
    .select(knex.raw('s.*, max(timestamp) as last_communication'))
    .innerJoin('student as s', 'ss.student_id', 's.id')
    .innerJoin('stakeholder as sh', 'ss.stakeholder_id', 'sh.id')
    .leftJoin('communication as comm', 'comm.student_id', 's.id' )
    .where('sh.id', id)
    .groupBy('s.id');
  },
  getOneStudentByID: (id) => {
    return knex('student AS s')
    .select(knex.raw('s.*, gt.name AS grade_name, min(timestamp) as initial_communication'))
    .leftJoin('grade_type AS gt', 'gt.id', 'grade_type_id')
    .rightJoin('communication as comm', 'comm.student_id', 's.id' )
    .where('s.id', id)
    .groupBy('s.id')
    //giving me Unhandled rejection error: column "gt.name" must appear in the GROUP BY clause or be used in an aggregate function
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
  },
  insertOneStudent: (student) => {
    return knex('student').insert(student).returning('*');
  },
  insertOneGuardian: (guardian) => {
    return knex('stakeholder').insert(guardian).returning('*');
  },
  insertOneRelation: (relation) => {
    return knex('student_stakeholder').insert(relation).returning('*');
  }
};
