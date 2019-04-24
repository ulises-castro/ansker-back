'use strict';

var _secret = require('../models/secret');

var _secret2 = _interopRequireDefault(_secret);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

require('dotenv').config();

router.post('/publish', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  var availableColours = ['#0000ff', '#ffa500', '#065535', '#ffc0cb', '#ff0000', '#003366', '#008080', '#8a2be2', '#666666', '#ff1493'];

  // console.log(req.user, "Holaaaa");
  var UserData = req.user;

  // Sended an invalid color, received an no-valid color
  if (availableColours.indexOf(req.body.backgroundColor) === -1) {
    res.status(403).json({
      error: 'secret.publish.invalid'
    });
  }

  var lastLocation = !UserData.ipLogs.length ? 0 : UserData.ipLogs.length - 1;
  var location = UserData.ipLogs[lastLocation];
  var author = UserData._id;
  location = location.location;

  var newSecret = new _secret2.default({
    author: author,
    content: res.content,
    backgroundColor: res.backgroundColor,
    location: location
  });

  res.status(200).json({ message: '' });
});

module.exports = router;