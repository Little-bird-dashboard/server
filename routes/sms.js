const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/smsqueries');
require('dotenv').config();
var client = require('twilio')(process.env.accountSid, process.env.authToken);

var texts = require('../twilio/texts.js');

Router.post('/initiate/:id', (req,res) => {
  Queries.findGuardianCellById(req.params.id)
    .then(response=>{
      texts.startingMessage(response.cell)
        .then(message=>{
          console.log(message);
          res.send(response);
        });
    });
});

Router.post('/single/:id', (req,res) => {
  Queries.findGuardianCellById(req.params.id)
    .then(response=>{
      client.messages.create({
          to: response.cell,
          from: '+18042982615',
          body: req.body.message,
      }, function(err, message) {
          console.log(message);
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
          Queries.insertOneCommunication(message_info)
            .then(communication => {
              console.log(communication);
              res.send(communication);
            });
      });

    });
  //insert into db
});

Router.post('/', (req, res) => {
  console.log('text sent');
  var twilio = require('twilio');
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  console.log(req.body);
  const response = Queries.getResponse(req.body.Body);
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
});

module.exports = Router;
