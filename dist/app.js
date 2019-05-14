'use strict';

require('./db');

require('dotenv').config();

// var proxy = require('express-http-proxy');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var passport = require('passport');
var axios = require('axios');
var cors = require('cors');

// Routes
var auth = require('./routes/auth');
var secret = require('./routes/secret');
var comment = require('./routes/comments');

// Load database connection


//Configure our app
var app = express();

// SocketIO

var corsOption = {
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
app.use('/api/secret', secret);
app.use('/api/comment', comment);
app.set('trust proxy', true);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function () {
  console.log('Cliente connected');
  io.emit("customEmit", { 'hola': 'b' });
});

// Sending response that app is alive
server.listen(3000, function () {
  console.log('SERVER IS ONLINE');
});