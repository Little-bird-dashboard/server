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
  Queries.getOneStudentByID(req.params.id)
    .then(student => {
      if(!student){
        res.statusCode(404);
        next(new Error('Student not found.'));
      }else{
        res.send(student);
      }
    });
});

Router.get('/:id/communications', (req, res, next) => {
  Queries.getCommunicationsByStudent(req.params.id)
    .then(communications => {
      if(!communications){
        res.statusCode(404);
        next(new Error('Communication not found.'));
      }else{
        res.send(communications);
      }
    });
});

Router.get('/:id/stakeholders', (req, res, next) => {
  Queries.getStakeholdersByStudentID(req.params.id)
    .then(stakeholders => {
      if(!stakeholders){
        res.statusCode(404);
        next(new Error('Stakeholders not found.'));
      }else{
        res.send(stakeholders);
      }
    });
});

Router.put('/:id', (req, res, next) => {
  let student = {

  };

  Queries.updateStudentByID(req.params.id, req.body)
    .then(student => {
      res.send('Updated', student);
    });
});

module.exports = Router;
