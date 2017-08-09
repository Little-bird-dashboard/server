const knex = require('./knex');

module.exports = {
  insertOneDayPeriod: (availability) => {
    console.log('i was called');
    return knex('guardian_availability').insert(availability).returning('*');
  }
};
