const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/queries');

Router.get('/', (req, res) => {
  Queries.getAllStudents()
    .then(studentList => {
      res.send(studentList);
    });
});

Router.get('/:id', (req, res, next) => {
  Queries.getAllStudentsByTeacher(req.params.id)
    .then(students => {
      if(!students){
        res.statusCode(404);
        next(new Error('Student not found.'));
      }else{
        res.send(students);
      }
    });
});
module.exports = Router;
