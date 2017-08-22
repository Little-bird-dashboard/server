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

Router.post('/add', (req,res,next) => {
  student_info = {
    student_id:'xxxxxx',
    first_name:'Demo',
    last_name: 'Student',
    grade_type_id:3,
    IEP_deadline: '2017-11-01 05:00:00',
    profile_img: './static/demo-icon.jpg'
  };
  Queries.insertOneStudent(student_info)
    .then(student => {
      console.log(student);
      guardian_info = {
        stakeholder_type_id:2,
        first_name: 'Demo',
        last_name: 'Guardian',
        email: 'demo.guardian@gmail.com',
        cell: req.body.cell
      };
      console.log(guardian_info);
      Queries.insertOneGuardian(guardian_info)
        .then(guardian=>{
          console.log(guardian);
          relation = {
            student_id: student.id,
            stakeholder_id: gaurdian.id,
            is_required: false,
            importance: 9
          };
          console.log(relation);
          Queries.insertOneRelation(relation)
            .then(response=>{
              console.log(response);
              if(!response){
                res.statusCode(404);
                next(new Error('Could not add student'));
              }else{
                res.send(response);
              }
            });
        });
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
