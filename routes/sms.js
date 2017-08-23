const express = require('express');
var app = express();
const Router = express.Router();
const Queries = require('../database/smsqueries');
require('dotenv').config();
var client = require('twilio')(process.env.accountSid, process.env.authToken);

var handleResponse = require('../twilio/responseHandler.js');
var texts = require('../twilio/texts.js');
const storeMessageInfo = require('../twilio/messageInfo');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

Router.post('/initiate/:id', (req,res) => {
  console.log('its weird im called');
  Queries.findGuardianCellById(req.params.id)
    .then(guardian_info=>{
      texts.startingMessage(guardian_info.cell)
        .then(message=>{
          let message_info= {
            communication_type_id: 1,
            raw_body: message.body,
            timestamp: Date.now(),
            student_id: req.params.id,
            stakeholder_id: guardian_info.stakeholder_id,
            MessageSid: message.sid,
            AccountSid: message.accountSid,
            message_status: message.status,
            communication_recipient_contact: req.body.to,
            communication_sender_contact: req.body.from
          };
          Queries.insertOneCommunication(message_info)
            .then(communication=> {
              res.send(communication);
            });
        });
    });
});


Router.post('/', (req, res) => {
  //log incoming text
  let incoming_message = req.body;
  storeMessageInfo.storeMessageInfo_incoming(incoming_message)
    .then(incoming_formatted => {
      Queries.insertOneCommunication(incoming_formatted)
        .then(response => console.log(response));
    });
  //responseHandler
  //insert outgoing text
  handleResponse.getResponse(req.body.Body)(req.body.From)
    .then(outgoing_message => {
      storeMessageInfo.storeMessageInfo_outgoing(outgoing_message)
        .then(outgoing_formatted=>{
          Queries.insertOneCommunication(outgoing_formatted)
            .then(response=>console.log(response));
        });
      res.send('conversation success')
    })
    .catch((error)=>{
      console.log(error);
    });
}); //end of router


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
          console.log(message_info);
          console.log('here');
          //insert into communications table
          Queries.insertOneCommunication(message_info)
            .then(communication => {
              res.send(communication);
            });
      });
    });
});
module.exports = Router;
