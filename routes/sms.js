const Express = require('express');
const Router = Express.Router();
const Queries = require('../database/smsqueries');

Router.post('/', (req, res) => {
  console.log('text sent');
  var twilio = require('twilio');
  var twiml = new twilio.twiml.MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  console.log(req.body);
  Queries.insertOneCommunication()
    .then(communication=> {
      res.send(communication);
    });
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

module.exports = Router;
