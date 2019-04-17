'use strict';

var mongoose = require('mongoose');

var uri = 'mongodb://localhost/ansker';

// Defining vars to connect to database
var options = {
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PWD,
  useNewUrlParser: true,
  useCreateIndex: true
};

mongoose.connect(uri, options).then(function () {
  console.log('connected to database');
}).catch(function (error) {
  console.log('There is a problem with database', error);
});