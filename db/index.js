const mongoose = require('mongoose');

const uri = 'mongodb://localhost/ansker';

mongoose.connect(uri, {}).then(() => {
  console.log('connected to database');
}).catch(error => {
  console.log('There is a problem with database', error);
});
