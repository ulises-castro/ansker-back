require('dotenv').config();

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var auth = require('./routes/auth');
var passport = require('passport');
var axios = require('axios');
var cors = require('cors');

// Load database connection
import './db';

//Configure our app
var app = express();

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOption));

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/passport.js');

app.use(passport.initialize());

app.use('/api', auth);

// Sending response that app is alive
app.listen(3000, () => {
  console.log('SERVER IS ONLINE');
});
