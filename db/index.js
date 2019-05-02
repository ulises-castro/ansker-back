require('dotenv').config();

const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/ansker';

const autoIndex = !!process.env.PRODUCTION;

// Defining vars to connect to database
const options = {
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PWD,
  auth: {
      authdb: 'admin'
  },
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex,
};

console.log(options);

mongoose.connect(uri, options).then(() => {
  console.log('connected to database');
}).catch(error => {
  console.log('There is a problem with database', error);
});
