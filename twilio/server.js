var http = require('http');
var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');
require('dotenv').config();

var app = express();

var texts = require('./texts.js');

app.use(bodyParser.urlencoded({extended:false}));

//figure out how to launch message
//let response = texts.startingMessage();
console.log(response);
console.log('should have sent message');
app.post('/sms', function(req, res) {
    //var twilio = require('twilio');
    //var twiml = new twilio.twiml.MessagingResponse();
    if(req.body.Body.toLowerCase().includes('monday') || req.body.Body.toLowerCase().includes('tuesday') || req.body.Body.toLowerCase().includes('wednesday') || req.body.Body.toLowerCase().includes('thursday') || req.body.Body.toLowerCase().includes('friday')) {
      //if response looks like day, ask for time of day
      texts.timeOfDayMessage();
      //continue on to update array of blackout dates
      if (req.body.Body.toLowerCase().includes('monday')) {
          //schedule.blackoutDates('monday');
      }
      if (req.body.Body.toLowerCase().includes('tuesday')) {
          //schedule.blackoutDates('tuesday');
      }
      if (req.body.Body.toLowerCase().includes('wednesday')) {
        //  schedule.blackoutDates('wednesday');
      }
      if (req.body.Body.toLowerCase().includes('thursday')) {
        //  schedule.blackoutDates('thursday');
      }
      if (req.body.Body.toLowerCase().includes('friday')) {
        //  schedule.blackoutDates('friday');
      }

    } else if(req.body.Body.toLowerCase().includes('morning') || req.body.Body.toLowerCase().includes('afternoon') || req.body.Body.toLowerCase().includes('either') || req.body.Body.toLowerCase().includes('both')){
          texts.preDoodleMessage();
          if (req.body.Body.toLowerCase().includes('morning')) {
            //schedule.morningOrAfternoon('morning');
          }
          if (req.body.Body.toLowerCase().includes('afternoon')) {
          //  schedule.morningOrAfternoon('afternoon');
          }
    }
      //  res.writeHead(200, {'Content-Type': 'text/xml'});
        //res.end(twiml.toString());
});



http.createServer(app).listen(1337, function () {
  console.log('Express server listening on port 1337');
});
