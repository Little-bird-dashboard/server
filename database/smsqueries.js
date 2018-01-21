const knex = require('./knex');

module.exports = {
  insertOneCommunication: (message) => {
    return knex('communication').insert(message).returning('*');
  },
  insertOneCommunicationTranslation: (message_translation) => {
    return knex('communication_translation').insert(message_translation).returning('*');
  },
  findStudentandStakeholder: (cell) => {
    return knex('stakeholder AS a')
    .select('a.id AS stakeholder_id', 'b.student_id AS student_id', 'd.id AS language_id', 'd.name AS language_name', 'd.google_id')
    .innerJoin('student_stakeholder AS b', 'b.stakeholder_id', 'a.id')
    .innerJoin('student as c', 'c.id', 'b.student_id')
    .leftJoin('language as d', 'd.id', 'c.language_id')
    .where('a.cell', cell)
    .first();
  },
  findGuardianCellById: (studentID) => {
    return knex('student_stakeholder AS a')
    .select('b.cell', 'b.id AS stakeholder_id', 'c.language_id', 'd.name AS language_name', 'd.google_id', 'c.IEP_deadline', 's.name AS school_name')
    .innerJoin('stakeholder AS b', 'a.stakeholder_id', 'b.id')
    .innerJoin('student as c', 'c.id', 'a.student_id')
    .innerJoin('school as s', 'c.school_id', 's.id')
    .leftJoin('language as d', 'd.id', 'c.language_id')
    .where('a.student_id', studentID)
    .andWhere('b.stakeholder_type_id', 2)
    .first();
  },
  getSpedInfoByStudentID: (id) => {
    return knex('student_stakeholder AS ss')
    .select('sh.*')
    .leftJoin('stakeholder AS sh','sh.id', 'ss.stakeholder_id')
    .leftJoin('stakeholder_type AS st', 'sh.stakeholder_type_id','st.id')
    .where('ss.student_id', id)
    .andWhere('sh.stakeholder_type_id', 1)
    .first();
  },
  updateGuardianCell: (stakeholder_id, cell) => {
    return knex('stakeholder')
    .where('id',stakeholder_id)
    .update('cell', cell)
    .returning('*');
  }
};
