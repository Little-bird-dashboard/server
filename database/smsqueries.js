const knex = require('./knex');

module.exports = {
  insertOneCommunication: (message) => {
    return knex('communication').insert(message).returning('*');
  },
  findStudentandStakeholder: (cell) => {
    return knex('stakeholder AS a')
    .select('a.id AS stakeholder_id', 'b.student_id AS student_id')
    .innerJoin('student_stakeholder AS b', 'b.stakeholder_id', 'a.id')
    .where('a.cell', cell)
    .first();
  },
  findGuardianCellById: (studentID) => {
    return knex('student_stakeholder AS a')
    .select('b.cell', 'b.id AS stakeholder_id')
    .innerJoin('stakeholder AS b', 'a.stakeholder_id', 'b.id')
    .where('a.student_id', studentID)
    .andWhere('b.stakeholder_type_id', 2)
    .first();
  }
};
