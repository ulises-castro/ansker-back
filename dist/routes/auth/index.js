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

// Configuration
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secret = process.env.JWT_SECRET_PASSWORD;

// Post login/ Register login
router.post('/login', function (req, res, next) {
  var tokenFB = req.body.tokenFB;


  var payload = {
    tokenFB: tokenFB
  };

  var response = (0, _facebookAuth2.default)(payload.tokenFB);
  console.log(req.body, "req ====");

  if (response && response.length) {
    var token = jwt.sign(payload, jwtOptions.secret);

    return res.status(200).json({
      token: response.id
    });
  } else {
    return res.status(403).json({
      token: false
    });
  }
});

router.post('/secret', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  res.json({ message: "Successs!" });
});

module.exports = router;