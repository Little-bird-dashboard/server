const  express = require('express');
const  path = require('path');
const  favicon = require('serve-favicon');
const  logger = require('morgan');
const  cookieParser = require('cookie-parser');
const  bodyParser = require('body-parser');
const  Cors = require('cors');
require('dotenv').config();

const app = express();

const students = require('./routes/students');
const sms = require('./routes/sms');
const auth = require('./auth/routes')
const schedule = require('./routes/schedule');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Cors());

app.use('/students', students);
app.use('/sms', sms);
app.use('/auth', auth);
app.use('/schedule', schedule);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || res.statusCode || 500);
  res.json({message: err.message, error:req.app.get('env') === 'development' ? err : {} });
});

module.exports = app;
