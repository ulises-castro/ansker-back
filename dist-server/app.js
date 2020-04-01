"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("./db");

require('dotenv').config(); // var proxy = require('express-http-proxy');


var allCities = require('all-the-cities-mongodb');

var countries = require('country-data').countries;

var express = require('express');

var path = require('path');

var bodyParser = require('body-parser');

var passport = require('passport');

var axios = require('axios');

var cors = require('cors'); // Routes


var auth = require('./routes/auth');

var secret = require('./routes/secret');

var comment = require('./routes/comments'); // Controllers


var userController = require('./controllers/user'); // Load database connection


//Configure our app
var app = express();
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  exposedHeaders: ['Authorization']
};
app.use(cors(corsOption));
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/passport.js');

app.use(passport.initialize());
app.set('trust proxy', true);
app.use('/api', auth);
app.use('/api/secret', secret);
app.use('/api/comment', comment); // Google auth ---------------------------------
// Geting token sending code
// app.post('/api/autheticate/google/token', userController.requestGmailAuth)
// Get code

app.get('/api/authenticate/google', userController.getAccessTokenFromCode); // ------------------------------------------
// TODO: Refactor this and create its controller to keep dry code
//Get cities by name

app.get('/api/searchPlace/:city', function (req, res) {
  var {
    city
  } = req.params;
  city = city.toLowerCase(); // return console.log(req.params);

  var cities = allCities.filter(cityCurrent => {
    if (cityCurrent.name.toLowerCase().match(city)) {
      var countryData = countries[cityCurrent.country];
      cityCurrent.countryName = countryData.name;
      cityCurrent.flag = countryData.emoji;
      return cityCurrent;
    }
  });
  cities = cities.sort((a, b) => {
    if (a.population > b.population) return -1;else if (b.population > a.population) return 1;else return 0;
  }); // cities = cities.sort((a, b) => {
  //   if (a.country === 'MX' && b.country !== 'MX')
  //     return -1;
  //   else if (a.country !== 'MX' && b.country === 'MX')
  //     return 1;
  //   else
  //     return 0;
  // });

  cities = cities.slice(0, 5);
  return res.status(200).json({
    cities
  });
}); // SocketIO, configure to send information

var server = require('http').createServer(app);

var io = require('socket.io')(server);

io.on('connection', () => {
  console.log('Cliente connected');
  io.emit("customEmit", {
    'hola': 'b'
  });
}); // Sending response that app is alive

var port = process.env.PORT || '3000';
server.listen(port, () => {
  console.log('SERVER IS ONLINE');
});
var _default = app;
exports.default = _default;