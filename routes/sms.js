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
  // message= {
  //   SmsMessageSid:req.body.SmsMessageSid,
  //   SmsStatus: req.body.SmsStatus,
  //   Body: req.body.Body
  // }
  //insert message into the database
  Queries.insertOneCommunication(message)
    .then(communication=> {
      //insert future logic
      //res.send(communication);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    });

});

module.exports = Router;
