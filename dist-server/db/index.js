"use strict";

;

var mongoose = require('mongoose');

var uri = 'mongodb://127.0.0.1:27017/ansker';
var autoIndex = !!process.env.PRODUCTION; // Defining vars to connect to database

var options = {
  authSource: 'admin',
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PWD,
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // reconnectTries: 30,
  // reconnectInterval: 500, // in ms

};
console.log(options);
mongoose.connect(uri, options).then(() => {
  console.log('connected to database');
}).catch(error => {
  console.log('There is a problem with database', error);
});