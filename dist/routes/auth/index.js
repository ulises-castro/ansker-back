'use strict';

var _facebookAuth = require('../../auth/facebook-auth.js');

var _facebookAuth2 = _interopRequireDefault(_facebookAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

require('dotenv').config();

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

// Post login/ Register login vía facebook\
router.post('/login', async function (req, res, next) {
  var tokenFB = req.body.tokenFB;


  var payload = {
    tokenFB: tokenFB
  };

  var ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Find User via Facebook || Register if user doesn't exists in database
  var response = await (0, _facebookAuth2.default)(payload.tokenFB, ipUser);

  //Get last position
  // TODO: Get clear this code and break into chunks of code and files.
  console.log(response, "RESPONSEEEEEE");

  var sendInvalidUser = {
    token: false,
    status: false,
    error: 'login.failed_token'
  };

  if (!response) {
    return res.status(403).json(sendInvalidUser);
  }

  // TODO register new ips if users have a new one ####, get last register
  // let lastLocation = response.ipLogs.length;
  // Find out how to get the lasted record
  // lastLocation = (lastLocation) ? lastLocation - 1 : 0;
  var lastLocation = 0;

  lastLocation = response.ipLogs[lastLocation].location;
  var _lastLocation = lastLocation,
      city = _lastLocation.city,
      regionName = _lastLocation.regionName,
      regionCode = _lastLocation.regionCode,
      countryCode = _lastLocation.countryCode;


  var userLocation = {
    city: city,
    regionName: regionName,
    regionCode: regionCode,
    countryCode: countryCode
  };

  var userData = {};
  userData.facebookId = response.authProviders.facebook.id;
  userData.id = '' + response._id;
  // console.log(req.body, payload, "req ====");

  // Returned respones based on response value
  if (response && response._id) {
    var token = jwt.sign(userData.id, jwtOptions.secret);

    return res.status(200).json({
      token: token,
      userLocation: userLocation,
      status: true
    });
  } else {
    return res.status(403).json(sendInvalidUser);
  }
});

module.exports = router;