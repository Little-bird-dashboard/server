const knex = require('../database/knex');

module.exports = {
  findCoordiantorByEmail: (email) => {
    return knex('stakeholder').where('email', email).first();
  },
  findPasswordById: (id) => {
    return knex('login').select('password').where('stakeholder_id', id).first();
  },
  findStakeholderTypeById: (id) => {
    return knex('stakeholder_type').select('type').where('id', id).first();
  }
}
