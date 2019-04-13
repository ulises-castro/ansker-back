'use strict';

var _facebookAuth = require('../auth/facebook-auth');

var _facebookAuth2 = _interopRequireDefault(_facebookAuth);

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

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('Aqui entro, payload', jwt_payload, (0, _facebookAuth2.default)(jwt_payload));

  // getFacebookUser(jwt_payload);

  next(false, { user: 'hola' });
});

passport.use(strategy);