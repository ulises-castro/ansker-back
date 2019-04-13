'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var auth = require('./routes/auth');
var passport = require('passport');
var axios = require('axios');
// const session = require('express-session');
//Configure our app
var app = express();

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/passport.js');

app.use(passport.initialize());

app.use('/api', auth);

// Sending response that app is alive
app.listen(3000, function () {
  console.log('SERVER IS ONLINE');
});