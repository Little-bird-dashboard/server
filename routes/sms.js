const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/smsqueries');
require('dotenv').config();
var client = require('twilio')(process.env.accountSid, process.env.authToken);

var handleResponse = require('../twilio/responseHandler.js');
var texts = require('../twilio/texts.js');


Router.post('/initiate/:id', (req,res) => {
  Queries.findGuardianCellById(req.params.id)
    .then(guardian_info=>{
      texts.startingMessage(guardian_info.cell)
        .then(message=>{
          console.log(message);
          Queries.findStudentandStakeholder(req.body.From)
            .then(ids => {
              message= {
                communication_type_id: 1,
                raw_body: req.body.Body,
                timestamp: Date.now(),
                student_id: ids.student_id,
                stakeholder_id: ids.stakeholder_id,
                MessageSid: req.body.MessageSid,
                AccountSid: req.body.AccountSid,
                message_status: req.body.SmsStatus,
                communication_recipient_contact: req.body.To,
                communication_sender_contact: req.body.From
              };
              Queries.insertOneCommunication(message)
                .then(communication=> {
                  console.log(communication);
                  //insert future logic
                  //res.send(communication);
                  res.writeHead(200, {'Content-Type': 'text/xml'});
                  res.end(twiml.toString());
                });
            });
          res.send(guardian_info);
        });
    });
});


Router.post('/', (req, res) => {
  var twilio = require('twilio');
  var twiml = new twilio.twiml.MessagingResponse();
//  twiml.message('The Robots are coming! Head for the hills!');
console.log('hereeee');
console.log(req.body.From);
  handleResponse.getResponse(req.body.Body)(req.body.From)
    .then(message => {
      console.log('hir');
      console.log(message);
      res.send(req.body.Body)
    }).catch((error)=>{
      console.log(error);
    });
  // Queries.findStudentandStakeholder(req.body.From)
  //   .then(ids => {
  //     message= {
  //       communication_type_id: 1,
  //       raw_body: req.body.Body,
  //       timestamp: Date.now(),
  //       student_id: ids.student_id,
  //       stakeholder_id: ids.stakeholder_id,
  //       MessageSid: req.body.MessageSid,
  //       AccountSid: req.body.AccountSid,
  //       message_status: req.body.SmsStatus,
  //       communication_recipient_contact: req.body.To,
  //       communication_sender_contact: req.body.From
  //     };
  //     Queries.insertOneCommunication(message)
  //       .then(communication=> {
  //         console.log(communication);
  //         //insert future logic
  //         //res.send(communication);
  //         res.writeHead(200, {'Content-Type': 'text/xml'});
  //         res.end(twiml.toString());
  //       });
  //   });
});


Router.post('/confirm/:id', (req,res) => {
  Queries.findGuardianCellById(req.params.id)
    .then(response=>{
      texts.confirmationInitiationMessage(response.cell)
        .then(message=>{
          console.log(message);
          res.send(response);
        });
    });
});


//route called in the 'initiate conversation button' on student page
//sends welcome message for IEP scheduler
Router.post('/single/:id', (req,res) => {
  //get guardian cell and id based on student id
  Queries.findGuardianCellById(req.params.id)
    .then(response=>{
      //send intro message to parent
      client.messages.create({
          to: response.cell,
          from: '+18042982615',
          body: req.body.message,
      }, function(err, message) {
          //populate message object based on ajak, query, and messave response
          message_info= {
            communication_type_id: 1,
            raw_body: message.body,
            timestamp: Date.now(),
            student_id: req.params.id,
            stakeholder_id: response.guardian_id,
            MessageSid: message.sid,
            AccountSid: message.accountSid,
            message_status: message.status,
            communication_recipient_contact: message.to,
            communication_sender_contact: message.from
          };
          //insert into communications table
          Queries.insertOneCommunication(message_info)
            .then(communication => {
              res.send(communication);
            });
      });
    });
});
module.exports = Router;
