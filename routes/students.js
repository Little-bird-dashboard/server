const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/queries')

Router.get('/', (req, res) => {
  Queries.getAllStudents()
    .then(studentList => {
      res.send(studentList);
    });
});

Router.get('/:id', (req, res, next) => {
  Queries.getOneStudentByID(req.params.id)
    .then(student => {
      if(!student){
        res.statusCode(404);
        next(new Error('Student not found.'));
      }else{
        res.send(student);
      };
    });
});

module.exports = Router;
