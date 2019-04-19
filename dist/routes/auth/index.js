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

// TODO: Remove and declare in app.js
require('dotenv').config();

// Configuration
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

// Post login/ Register login vía facebook\
router.post('/login', function (req, res, next) {
  var tokenFB = req.body.tokenFB;


  var payload = {
    tokenFB: tokenFB
  };

  var ipUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Find User via Facebook || Register if user doesn't exists in database
  var response = (0, _facebookAuth2.default)(payload.tokenFB, ipUser);

  payload.id = response;
  console.log(req.body, "req ====");

  // Returned respones based on response value
  if (response && response !== null) {
    var token = jwt.sign(payload, jwtOptions.secret);

    return res.status(200).json({
      token: token,
      status: true
    });
  } else {
    return res.status(401).json({
      token: false,
      status: false,
      error: 'login.failed_token'
    });
  }
});

router.post('/secret', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  res.json({ message: "Successs!" });
});

module.exports = router;