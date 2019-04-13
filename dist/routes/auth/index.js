'use strict';

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

// Post login
router.post('/login', function (req, res, next) {

  var payload = { id: 1 };
  var token = jwt.sign(payload, jwtOptions.secret);
  return res.status(400).json({
    message: token
  });
});

router.post('/secret', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  console.log('hola');
  res.json({ message: "Successs! yotube" });
});

module.exports = router;