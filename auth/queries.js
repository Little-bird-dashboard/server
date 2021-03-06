const knex = require('../database/knex');

module.exports = {
  findCoordiantorByEmail: (email) => {
    return knex('stakeholder as sh')
      .select('school.name as school', 'login.password as password', 'sh.id as stakeholder_id', 'sh.stakeholder_type_id as stakeholder_type_id', 'st.type as stakeholder_type', 'sh.first_name as first_name', 'sh.last_name as last_name')
      .leftJoin('login', 'login.stakeholder_id', 'sh.id')
      .leftJoin('school', 'login.school_id', 'school.id')
      .leftJoin('stakeholder_type as st', 'sh.stakeholder_type_id', 'st.id')
      .where('sh.email', email).first();
  },
  findPasswordById: (id) => {
    return knex('login').select('password').where('stakeholder_id', id).first();
  },
  findStakeholderTypeById: (id) => {
    return knex('stakeholder_type').select('type').where('id', id).first();
  },
  findCoordiantorIdByEmail: (email) => {
    return knex('stakeholder').select('id').where('email', email).first();
  },
  updatePassword: (id, details) => {
    console.log('query', id, details);
    return knex('login').where('id', id).update(details).returning('*')
      .then(res => res[0])
  }
}
