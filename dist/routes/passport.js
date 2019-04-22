'use strict';

var _facebookAuth = require('../auth/facebook-auth');

var _facebookAuth2 = _interopRequireDefault(_facebookAuth);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var passport = require('passport');
var passportJWT = require('passport-jwt');
var jwt = require('jsonwebtoken');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Configuration

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET_PASSWORD;

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, done) {

  _user2.default.findOne({ '_id': jwt_payload }, function (err, user) {
    console.log('Aqui entro, payload', jwt_payload, user);
    if (err) {
      done(err, false);
    }

    done(null, user);
  });
});

passport.use(strategy);