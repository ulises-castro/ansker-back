'use strict';

var mongoose = require('mongoose');

var uri = 'mongodb://localhost/ansker';

mongoose.connect(uri, { useNewUrlParser: true }).then(function () {
  console.log('connected to database');
}).catch(function (error) {
  console.log('There is a problem with database', error);
});