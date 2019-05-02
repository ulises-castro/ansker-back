'use strict';

require('dotenv').config();

var mongoose = require('mongoose');

var uri = 'mongodb://localhost:27017/ansker';

var autoIndex = !!process.env.PRODUCTION;

// Defining vars to connect to database
var options = {
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PWD,
  auth: {
    authdb: 'admin'
  },
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: autoIndex
};

console.log(options);

mongoose.connect(uri, options).then(function () {
  console.log('connected to database');
}).catch(function (error) {
  console.log('There is a problem with database', error);
});