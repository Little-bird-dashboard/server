var http = require('http');
var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');

var app = express();

var texts = require('./texts.js');

app.use(bodyParser.urlencoded({extended:false}));
console.log('started');
// app.post('/sms', function(req, res) {
//   console.log('text sent');
//   var twilio = require('twilio');
//   var twiml = new twilio.twiml.MessagingResponse();
//   twiml.message('The Robots are coming! Head for the hills!');
//   console.log(req.body.Body);
//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
// });

// http.createServer(app).listen(1337, function () {
//   console.log("Express server listening on port 1337");
// });
