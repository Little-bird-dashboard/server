const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/smsqueries');

Router.get('/', (req, res) => {
  console.log('text sent');
  var twilio = require('twilio');
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  console.log(req.body.Body);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  Queries.insertOneCommunication()
    .then(communication=> {
      res.send(communication);
    });
});

module.exports = Router;
