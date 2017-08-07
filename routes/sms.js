const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/smsqueries');

Router.post('/', (req, res) => {
  console.log('text sent');
  var twilio = require('twilio');
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  console.log(req.body);
  //make object of what to keep in database
  message= {
    communication_type_id: 1,
    raw_body: req.body.Body,
    timestamp: Date.now(),
    student_id: 1 ,
    stakeholder_id: 2,
    MessageSid: req.body.MessageSid,
    AccountSid: req.body.AccountSid,
    message_status: req.body.SmsStatus,
    communication_recipient_contact: req.body.To,
    communication_sender_contact: req.body.From
  };
  //insert message into the database
  Queries.insertOneCommunication(message)
    .then(communication=> {
      console.log(communication);
      //insert future logic
      //res.send(communication);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    });

});

module.exports = Router;
