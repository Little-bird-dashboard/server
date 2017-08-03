const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/queries')

Router.get('/', (req, res) => {
  Queries.getAllStudents()
    .then(studentList => {
      res.send(studentList);
    });
});

module.exports = Router;
