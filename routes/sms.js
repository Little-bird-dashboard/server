const express = require('express');
var app = express();
const Router = express.Router();
const Queries = require('../database/smsqueries');
require('dotenv').config();
var client = require('twilio')(process.env.accountSid, process.env.authToken);

var handleResponse = require('../twilio/responseHandler.js');
var texts = require('../twilio/texts.js');
var spanish_texts = require('../twilio/spanish-texts.js');
var translator = require('../twilio/textTranslationsAdHoc.js');
const storeMessageInfo = require('../twilio/messageInfo');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

const Translate = require('@google-cloud/translate');
const projectId = 'littlebird-584b3';


Router.post('/initiate/:id', (req,res) => {
  Queries.findGuardianCellById(req.params.id)
    .then(guardian_info=>{
      if(guardian_info.language_id==2){
        spanish_texts.startingMessage(guardian_info.cell, guardian_info.IEP_deadline, guardian_info.school_name)
          .then(message=> {
            let message_info= {
              communication_type_id: 4,
              raw_body: translator.getTranslation(guardian_info.IEP_deadline, guardian_info.school_name,'en','startingMessage'),
              timestamp: Date.now(),
              student_id: req.params.id,
              stakeholder_id: 7,
              MessageSid: message.sid,
              AccountSid: message.accountSid,
              message_status: message.status,
              communication_recipient_contact: message.to,
              communication_sender_contact: message.from
            };
            Queries.insertOneCommunication(message_info)
              .then(communication=> {
                let translation = {
                  communication_id: communication[0].id,
                  language_id: 2,
                  foreign_language_body: translator.getTranslation(guardian_info.IEP_deadline, guardian_info.school_name,'es','startingMessage')
                };
                Queries.insertOneCommunicationTranslation(translation)
                  .then(res.send('message initiated successfully'));
              });
          });
      }
      else{
        texts.startingMessage(guardian_info.cell, guardian_info.IEP_deadline, guardian_info.school_name)
          .then(message=>{
            let message_info= {
              communication_type_id: 4,
              raw_body: message.body,
              timestamp: Date.now(),
              student_id: req.params.id,
              stakeholder_id: 7,
              MessageSid: message.sid,
              AccountSid: message.accountSid,
              message_status: message.status,
              communication_recipient_contact: message.to,
              communication_sender_contact: message.from
            };
            Queries.insertOneCommunication(message_info)
              .then(communication=> {
                res.send(communication);
              });
          });
      }
    });
});


Router.post('/', (req, res) => {
  let incoming_message = req.body;
  storeMessageInfo.storeMessageInfo_incoming(incoming_message)
    .then(response_object => {
      Queries.insertOneCommunication(response_object.incoming_formatted)
        .then(response => {
          if(response_object.language_id !== 1) {
            let translation = {
              communication_id: response[0].id,
              language_id: response_object.language_id,
              foreign_language_body: response_object.raw_response
            };
            Queries.insertOneCommunicationTranslation(translation)
              .then(trans_response => {
                Queries.findStudentandStakeholder(req.body.From)
                  .then(ids=>{
                    storeMessageInfo.callHandler(ids, incoming_message)
                    //if spanish, hangle here - this returns a message instance
                      .then(outgoing_message => {
                        storeMessageInfo.storeMessageInfo_outgoing(outgoing_message)
                          .then(response_object=>{
                            Queries.insertOneCommunication(response_object.outgoing_formatted)
                              .then(outgoing_response => {
                                if(response_object.language_id !== 1) {
                                  let translation = {
                                    communication_id: outgoing_response[0].id,
                                    language_id: response_object.language_id,
                                    foreign_language_body: response_object.raw_response
                                  };
                                  Queries.insertOneCommunicationTranslation(translation)
                                    .then(trans_response => console.log(trans_response));
                                }
                              });
                          });
                        res.send('conversation success');
                      })
                      .catch((error)=>{
                        console.log(error);
                      });
                  });
              });
          }
        });
    });
  //responseHandler
  //insert outgoing text
}); //end of router


Router.post('/confirm/:id', (req,res) => {
  Queries.findGuardianCellById(req.params.id)
    .then(guardian_info=>{
      if(guardian_info.language_id==2){
        spanish_texts.confirmationInitiationMessage(guardian_info.cell)
          .then(message=> {
            let message_info= {
              communication_type_id: 4,
              raw_body: translator.getTranslation('hold', 'hold','en','confirmationInitiationMessage'),
              timestamp: Date.now(),
              student_id: req.params.id,
              stakeholder_id: 7,
              MessageSid: message.sid,
              AccountSid: message.accountSid,
              message_status: message.status,
              communication_recipient_contact: message.to,
              communication_sender_contact: message.from
            };
            Queries.insertOneCommunication(message_info)
              .then(communication=> {
                let translation = {
                  communication_id: communication[0].id,
                  language_id: 2,
                  foreign_language_body: translator.getTranslation('hold', 'hold','en','confirmationInitiationMessage')
                };
                Queries.insertOneCommunicationTranslation(translation)
                  .then(res.send('message initiated successfully'));
              });
          });
      }
      else {
        texts.confirmationInitiationMessage(guardian_info.cell)
          .then(message=>{
            let message_info= {
              communication_type_id: 1,
              raw_body: message.body,
              timestamp: Date.now(),
              student_id: req.params.id,
              stakeholder_id: 7,
              MessageSid: message.sid,
              AccountSid: message.accountSid,
              message_status: message.status,
              communication_recipient_contact: message.to,
              communication_sender_contact: message.from
            };
            Queries.insertOneCommunication(message_info)
              .then(communication=> {
                res.send(communication);
              });
          });
      }
    });
});

//route called in the 'initiate conversation button' on student page
//sends welcome message for IEP scheduler
Router.post('/single/:id', (req,res) => {
  //get guardian cell and id based on student id
  Queries.findGuardianCellById(req.params.id)
    .then(response=>{
      let message_body = '';
      if(response.language_id==2){
        const translate = new Translate({
          projectId: projectId,
        });
        const text = req.body.message;
        const target = 'es';

        return translate
          .translate(text,target)
          .then(results => {
            const translation = results[0];
            message_body = `${translation}`;

            client.messages.create({
                to: response.cell,
                from: '+18042982615',
                body: message_body,
            }, function(err, message) {
                message_info= {
                  communication_type_id: 1,
                  raw_body: req.body.message,
                  timestamp: Date.now(),
                  student_id: req.params.id,
                  stakeholder_id: 1,
                  MessageSid: message.sid,
                  AccountSid: message.accountSid,
                  message_status: message.status,
                  communication_recipient_contact: message.to,
                  communication_sender_contact: message.from
                };
                //insert into communications table
                Queries.insertOneCommunication(message_info)
                  .then(communication => {
                    let translation = {
                      communication_id: communication[0].id,
                      language_id: 2,
                      foreign_language_body: message_body
                    };
                    Queries.insertOneCommunicationTranslation(translation)
                      .then(res.send('ad hoc message sent successfully'));
                  });
            });
          });
      }
      else {
        //send intro message to parent
        client.messages.create({
            to: response.cell,
            from: '+18042982615',
            body: req.body.message,
        }, function(err, message) {
            message_info= {
              communication_type_id: 1,
              raw_body: message.body,
              timestamp: Date.now(),
              student_id: req.params.id,
              stakeholder_id: 1,
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
      }
    });
});
module.exports = Router;
