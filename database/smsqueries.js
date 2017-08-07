const knex = require('./knex');

module.exports = {
  insertOneCommunication: (message) => {
    return knex('communication').insert(message).returning('*');
  }
};
