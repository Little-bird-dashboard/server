var http = require('http');
var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');
require('dotenv').config();

var app = express();

var texts = require('./texts.js');

app.use(bodyParser.urlencoded({extended:false}));
