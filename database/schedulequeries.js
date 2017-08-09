const knex = require('./knex');

module.exports = {
  insertOneDayPeriod: (availability) => {
    console.log('i was called');
    return knex('guardian_availability').insert(availability).returning('*');
  },
  getGuardianAvailabilityforDoodle: (student_id) => {
    return knex.raw('select * from meeting_start_time where day in (select distinct date from guardian_availability) and timeframe in (select distinct timeframe from guardian_availability)');
  }
};
