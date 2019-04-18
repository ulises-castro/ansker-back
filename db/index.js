require('dotenv').config();

const mongoose = require('mongoose');

const uri = 'mongodb://localhost/ansker';

const autoIndex = !!process.env.PRODUCTION;

// Defining vars to connect to database
const options = {
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PWD,
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex,
};

mongoose.connect(uri, options).then(() => {
  console.log('connected to database');
}).catch(error => {
  console.log('There is a problem with database', error);
});
